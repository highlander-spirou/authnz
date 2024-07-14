import type { Request, Response } from "express";
import userService from "./users.service";
import { UserNotFoundException } from "./user.exceptions";

const userController = {
  getInfo: async (req: Request, res: Response) => {
    const { userId } = req.context;
    console.log('userId', userId)
    try {
        const userInfo = await userService.getInfo(userId);
        return res.json(userInfo);
    } catch (error) {
        if(error instanceof UserNotFoundException) {
            return res.status(401).json({message: "Unable to identify user, please login again"})
        } else {
            return res.status(500).end()
        }
    }
  },
};

export default userController;
