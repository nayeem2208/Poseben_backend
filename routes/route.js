import express from "express";
import Authentication from "../controllers/controllers.js";
const router=express.Router()

router.post('/login',Authentication.login)
router.post('/signup',Authentication.registerUser)
router.post('/GoogleSignup',Authentication.googleAuth)
router.post('/GoogleLogin',Authentication.googleLogin)
router.get('/verifyEmail',Authentication.verifyEmail)
router.get('/validateEmail',Authentication.emailValidation)
export default router