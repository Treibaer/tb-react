import bcrypt from "bcryptjs";
import express, { NextFunction, Request, Response } from "express";
import { body, check, validationResult } from "express-validator";
import { User } from "../models/user.js";
import Transformer from "../utils/Transformer.js";
import { AccessToken } from "../models/access-token.js";

const router = express.Router();

// router.post("/login", async (req, res) => {});

router.post(
  "/register",
  [
    check("username", "Please enter a valid username").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check(
      "password",
      "Please enter a valid password at least 6 chars"
    ).isLength({
      min: 6,
    }),
    check("confirmPassword", "Please enter confirm password at least 6 chars")
      .isLength({
        min: 6,
      })
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords must match");
        } else {
          return value;
        }
      }),
    body("email").custom(async (value) => {
      const user = await User.findOne({ where: { email: value } });
      if (user) {
        throw new Error("email already in use");
      }
      return true;
    }),
    body("username").custom(async (value) => {
      const user = await User.findOne({ where: { firstName: value } });
      if (user) {
        throw new Error("username already in use");
      }
      return true;
    }),
  ],
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const hashedPassword = await bcrypt.hash(req.body.password, 12);
      const createdUser = await User.create({
        email: req.body.email,
        password: hashedPassword,
        firstName: req.body.username,
      });
      res.status(201).json(Transformer.user(createdUser));
    } else {
      return res.status(422).json({
        message: errors.array()[0].msg,
      });
    }
  }
);

router.post(
  "/login",
  [
    check("client", "Please enter a valid client").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    async function createToken() {
      const token = bcrypt.hashSync(Math.random().toString(10), 12);
      const existingToken = await AccessToken.findOne({
        where: { value: token },
      });
      if (existingToken) {
        return await createToken();
      }
      return token;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: errors.array()[0].msg,
      });
    }

    try {
      const user = await User.findOne({ where: { email: req.body.email } });
      if (!user) {
        return res.status(422).json({
          message: "Invalid email or password",
        });
      }

      const isValid = await bcrypt.compare(req.body.password, user.password);

      if (!isValid) {
        return res.status(422).json({
          message: "Invalid email or password",
        });
      }
      const value = await createToken();
      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      const token = await AccessToken.create({ value, user_id: user.id, client: req.body.client, ip });
      return res.status(200).json(Transformer.accessToken(token));
    } catch (error) {
      return next(error);
    }
  }
);

export default router;
