import { validationResult } from "express-validator";

export const getLogin = async (req: any, res: any) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  res.status(200).json({ message: "Logged in" });
}
