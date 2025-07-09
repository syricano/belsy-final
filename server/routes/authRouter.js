import { Router } from "express";
import validateZod from "../middleware/validateZod.js";
import verifyToken from "../middleware/verifyToken.js";
import {me, signup, signin, signout, forgotPassword, resetPassword} from "../controllers/auth.js";
import { userSchema, signInSchema } from "../zod/Schemas.js";

const authRouter = Router();

authRouter.get("/me", verifyToken, me);
authRouter.post("/signup", validateZod(userSchema), signup);
authRouter.post("/signin", validateZod(signInSchema), signin);
authRouter.post("/signout", signout);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", resetPassword);

export default authRouter;
