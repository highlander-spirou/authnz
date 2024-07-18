import type { Request, Response } from "express";
import authService from "./auth.service";
import * as AuthExceptions from "./auth.exceptions";
import { ZodError } from "zod";
import { loginDTO, registerDTO } from "./dto";
import { sendMail } from "../../lib/email";

const authController = {
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = await loginDTO.parseAsync(req.body);
      const secureToken = await authService.login(email, password);

      res.cookie("user-session", secureToken, {
        maxAge: +process.env.DEFAULT_TTL! * 1000 * 60 * 60,
        httpOnly: true,
      });

      return res.status(200).json({ message: "OK" });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Payload Error" });
      } else if (error instanceof AuthExceptions.EmailNotFoundException) {
        return res.status(404).json({ message: "Email Not Found" });
      } else if (error instanceof AuthExceptions.PasswordNotMatchException) {
        /*
        401 Forbidden: Email found, but conflicted password
        403 is role-based authorization, cannot be used for conflicted pwd 
        => 401 is the only valid response 
        */
        return res.status(401).json({ message: "Password Incorrect" });
      } else {
        return res.status(500).json({ message: "Unknown Error" });
      }
    }
  },
  register: async (req: Request, res: Response) => {
    try {
      const { email, password, name } = await registerDTO.parseAsync(req.body);
      await authService.register(email, password, name);
      return res.status(200).json({ message: "OK" });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Payload Error" });
      } else if (
        error instanceof AuthExceptions.DuplicateRegisterEmailException
      ) {
        return res.status(400).json({ message: "Email has been registered" });
      } else {
        return res.status(500).json({ message: "Unknown Error" });
      }
    }
  },
  sendEmailVerify: async (req: Request, res: Response) => {
    const { userId } = req.context;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const { token, clientEmail } = await authService.sendEmailVerify(userId);
      await sendMail(clientEmail, token);
      return res.status(200).json({ message: "OK" });
    } catch (error) {
      if (
        error instanceof AuthExceptions.EmailVerificationRequestMaxException
      ) {
        return res.status(403).json({
          message: "Verify email request limit reaches, try again in 5 hours",
        });
      } else if (
        error instanceof AuthExceptions.EmailAlreadyVerifiedException
      ) {
        return res.status(403).json({ message: "Email is already verified" });
      } else {
        return res.status(500).json({ message: "Unknown Error" });
      }
    }
  },
  verifyEmail: async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      await authService.verifyEmail(token);
      return res.status(200).json({ message: "OK" });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Payload Error" });
      } else if (
        error instanceof AuthExceptions.EmailVerificationNotFoundException
      ) {
        return res
          .status(403)
          .json({ message: "Illegal email verification request" });
      } else if (
        error instanceof AuthExceptions.EmailVerificationExpiredException
      ) {
        return res
          .status(403)
          .json({ message: "Email verification request expired" });
      }
    }
  },
};

export default authController;
