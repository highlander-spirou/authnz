import { Router } from "express";
import { signToken } from "../lib/jwt-token";

const authRouter = Router();

const users = {
  user1: "pw1",
  user2: "pw2",
};

authRouter.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (users[username] && users[username] === password) {
    const token = signToken({ userId: 1, role: "vào!" });
    res.status(200).json({ token });
  } else {
    res.status(401).json({ message: "đĩ mẹ mày cút" });
  }
});

export default authRouter;
