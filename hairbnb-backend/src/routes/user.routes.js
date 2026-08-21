import express from "express";
const router = express.Router({ mergeParams: true });

import { accountAuth } from "../middlewares/auth.middleware.js";
import wrapAsync from "../utils/async.handler.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";


// CONTROLLERS
import { getUser, getDeleteUserPage, postDeleteUser } from "../controllers/user.controller.js";

// U can see anyone's account.
router.get('/', authMiddleware ,wrapAsync(getUser));

// see delete user page.
router.get('/delete', authMiddleware, accountAuth, wrapAsync(getDeleteUserPage));

// Delete user.
router.post('/delete', authMiddleware, accountAuth, wrapAsync(postDeleteUser));   

export default router;