import express from "express";
import Authentication from "../controllers/controllers.js";
const router=express.Router()

router.post('/login',Authentication.login)
router.post('/signup',Authentication.registerUser)
router.post('/GoogleSignup',Authentication.googleAuth)
router.post('/GoogleLogin',Authentication.googleLogin)

export default router