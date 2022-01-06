import express from 'express';
import { check } from 'express-validator'
const router = express.Router();
import { getUsers, login, signup } from "../controllers/users-controller"
import {fileUpload} from "../middleware/file-upload"
const dummyUsers = []

router.get('/', getUsers);
router.post("/login", login);
router.post("/signup", fileUpload.single('image'),[check('uname').not().isEmpty(), check('email').normalizeEmail().isEmail(), check('pwd').isLength({ min: 4 })], signup);
//check('places').not().isEmpty(),
module.exports = router