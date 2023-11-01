import express from "express";
import {pagination} from "../middlewares/user.middlewares";

const userRoutes = express.Router();

import { findAllUser, findOneUser, create, update, remove } from "../controller/users.controller";

import { isAuth } from "../middlewares/auth.middlewares";

// GET All users
userRoutes.get("/", pagination, findAllUser);

// GET ONE user
userRoutes.get("/:id", findOneUser);

userRoutes.post("/", isAuth, create);

userRoutes.patch("/:id", update);


userRoutes.delete("/:id", remove);

export default userRoutes;

