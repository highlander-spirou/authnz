import type { Request, Response } from "express";
import userService from "./users.service";
import * as UserException from "./user.exceptions";
import { ZodError } from "zod";
import { putEmailDTO, putInfoDTO } from "./dto";

const userController = {
  getInfo: async (req: Request, res: Response) => {
    const { userId } = req.context;
    try {
      const userInfo = await userService.getInfo(userId);
      return res.json(userInfo);
    } catch (error) {
      if (error instanceof UserException.UserNotFoundException) {
        return res
          .status(401)
          .json({ message: "Unable to identify user, please login again" });
      } else {
        return res.status(500).end();
      }
    }
  },
  changeInfo: async (req: Request, res: Response) => {
    try {
      const { userId } = req.context;
      const payload = await putInfoDTO.parseAsync(req.body);
      await userService.changeProfile(userId, payload);
      return res.status(200).json({ message: "OK" });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Payload Error" });
      }
    }
  },
  changeEmail: async (req: Request, res: Response) => {
    try {
      const { userId } = req.context;
      const payload = await putEmailDTO.parseAsync(req.body);
      await userService.changeEmail(userId, payload);
      return res.status(200).json({ message: "OK" });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Payload Error" });
      } else if (error instanceof UserException.UserNotFoundException) {
        return res
          .status(401)
          .json({ message: "Unable to identify user, please login again" });
      } else if (error instanceof UserException.UserEmailNotVerifiedException) {
        return res.status(403).json({ message: "Email not verified" });
      }
    }
  },
};

export default userController;
