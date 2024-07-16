import type { Request, Response } from "express";
import authService from "./auth.service";
import { loginDTO } from "./dto/loginDTO";
import * as AuthExceptions from "./auth.exceptions";
import { ZodError } from "zod";
import { registerDTO } from "./dto/registerDTO";

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
};

export default authController;
