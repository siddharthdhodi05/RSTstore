import express from 'express';

import {
	authUser,
	deleteUser,
	getUserById,
	getUserProfile,
	getUsers,
	logoutUser,
	registerUser,
	updateUser,
	updateUserProfile,
} from '#controllers/user.controllers.js';
import { admin, protect } from '#middlewares/auth.middleware.js';

const router = express.Router();

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.route('/login').post(authUser);
router.route('/logout').post(logoutUser);
router
	.route('/profile')
	.get(protect, getUserProfile)
	.put(protect, updateUserProfile);
router
	.route('/:id')
	.delete(protect, admin, deleteUser)
	.get(protect, getUserById)
	.put(protect, admin, updateUser);

export default router;
