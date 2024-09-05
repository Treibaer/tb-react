import express from "express";
import { body, check, validationResult } from "express-validator";
import { User } from "../models/user.js";
import Transformer from "../utils/Transformer.js";

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
    // validate request
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const createdUser = await User.create({
        email: req.body.email,
        password: req.body.password,
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

export default router;
