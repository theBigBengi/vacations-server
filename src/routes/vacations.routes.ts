import { Router } from "express";
import transformVaction from "../middlewares/transformVacations.middleware";
import protectedRoutes from "../middlewares/protected.middleware";
import schemaValidator from "../middlewares/validator.middleware";
import withVacation from "../middlewares/withVacation.middleware";
import parseFiles from "../middlewares/extractFiles.middleware";
import {
  getVacations,
  createVacation,
  getVacationById,
  updateVacationById,
  deleteVacationById,
  getReports,
  unfollowVacation,
  followVacation,
  searchVacation,
} from "../controllers/vacations.controller";
import _catch from "../utils/catch";

const vacationsRouter = Router();

// Protect routes (all routes)
vacationsRouter.use(protectedRoutes());

// Get all vacations
vacationsRouter.get("/", transformVaction, getVacations);

// Get all vacations
vacationsRouter.get("/search", transformVaction, searchVacation);

// Create a new vacation (Admin only)
vacationsRouter.post(
  "/",
  protectedRoutes("ADMIN"),
  parseFiles,
  schemaValidator,
  createVacation
);

// Get vacation by ID
vacationsRouter.get("/:id", withVacation, transformVaction, getVacationById);

// Update vacation by ID (Admin only)
vacationsRouter.patch(
  "/:id",
  protectedRoutes("ADMIN"),
  schemaValidator,
  withVacation,
  parseFiles,
  transformVaction,
  updateVacationById
);

// Delete vacation by ID (Admin only)
vacationsRouter.delete(
  "/:id",
  protectedRoutes("ADMIN"),
  withVacation,
  deleteVacationById
);

// Get vacation reports (Admin only)
vacationsRouter.get("/reports/:type", protectedRoutes("ADMIN"), getReports);

// Follow a vacation
vacationsRouter.get("/:id/follow", withVacation, followVacation);

// Unfollow a vacation
vacationsRouter.get("/:id/unfollow", withVacation, unfollowVacation);

export default vacationsRouter;
