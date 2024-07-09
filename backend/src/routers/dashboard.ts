import { Router } from "express";
import { routeGuard } from "../middlewares/route-guard";

const dashboard = Router();

dashboard.use(routeGuard);

dashboard.get("/", async (req, res) => {
  res.json({ msg: "dashboard" });
});

export default dashboard;
