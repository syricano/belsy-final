import { Router } from "express";
import validateZod from "../middleware/validateZod.js";
import verifyToken from "../middleware/verifyToken.js";
import {me, signup, signin, signout, forgotPassword, resetPassword,updateProfile,deleteAccount} from "../controllers/auth.js";
import {
  userSchema,
  signInSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  changePasswordSchema,
  deleteAccountSchema,
  userRoleSchema
} from "../zod/Schemas.js";

const authRouter = Router();

authRouter.get("/me", verifyToken, me);
authRouter.post("/signup", validateZod(userSchema.POST), signup);
authRouter.post("/signin", validateZod(signInSchema), signin);
authRouter.put("/update-profile", verifyToken, validateZod(updateProfileSchema), updateProfile);
authRouter.post("/delete-account", verifyToken, validateZod(deleteAccountSchema), deleteAccount);
authRouter.post("/signout", signout);
authRouter.post("/forgot-password", validateZod(forgotPasswordSchema), forgotPassword);
authRouter.post("/reset-password/:token", validateZod(resetPasswordSchema), resetPassword);

export default authRouter;
