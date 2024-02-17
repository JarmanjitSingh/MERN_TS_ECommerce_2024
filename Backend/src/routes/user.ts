import express from "express";
import { deleteUser, getAllUsers, getSingleUser, newUser } from "../controllers/user.js";
import { adminOnly } from "../middlewares/auth.js";

const router = express.Router();

// route -  /api/v1/new
router.route("/new").post(newUser)

router.get("/all", getAllUsers)

router.get("/:id", adminOnly, getSingleUser)
router.delete("/:id", adminOnly, deleteUser)

export default router;