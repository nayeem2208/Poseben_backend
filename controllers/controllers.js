import usermodel from "../models/model.js";
import generateToken from "../utils/jwt.js";
import jwt from "jsonwebtoken";
import SendVerifyMail from "../utils/nodemailer.js";
import axios from 'axios'

const Authentication = {
  login: async (req, res) => {
    try {
      console.log(req.body, "body");
      const { email, password } = req.body;
      const user = await usermodel.findOne({ email });
      if (user && (await user.matchPassword(password))) {
        if (user.verified == true) {
          let token = generateToken(res, user._id);
          console.log(token, "token");
          res.json({
            _id: user._id,
            email: user.email,
            token,
          });
        }
        else{
          res.status(401).json({ error: "Please verify your email" })
        }
      } else {
        res.status(401).json({ error: "Incorrect email or password" });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  },
  registerUser: async (req, res) => {
    const { email, password } = req.body;

    try {
      let userExists = await usermodel.findOne({ email });

      if (userExists) {
        res.status(400).json({ error: "User already exists" });
      } else {
        userExists = await usermodel.create({
          email,
          password,
        });
        SendVerifyMail(email);
        res.status(200).json("Please check your email for verification");
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Registration failed", error: error.message });
    }
  },
  googleLogin: async (req, res) => {
    try {
      const token = req.body.credentialResponse.credential;
      const decode = jwt.decode(token);
      const { email } = decode;
      const user = await usermodel.findOne({ email });
      if (user) {
        const token = generateToken(res, user._id);
        res.status(200).json({
          id: user._id,
          email: user.email,
          token,
        });
      } else {
        res.status(400).json("Invalid User");
      }
    } catch (error) {
      res.status(400).json(error);
      
    }
  },
  googleAuth: async (req, res) => {
    try {
      console.log("hiiiiiii i m hrere");
      const token = req.body.credentialResponse.credential;
      const decode = jwt.decode(token);
      const { email, sub } = decode;
      const userExists = await usermodel.findOne({ email });
      if (userExists) {
        res.status(400).json({ error: "User already exists" });
      }
      const user = await usermodel.create({
        email,
        sub,
      });
      if (user) {
        const token = generateToken(res, user._id);
        res.status(200).json({
          id: user._id,
          email: user.email,
          token,
        });
      } else {
        console.log("user is not created");
        res.status(400).json("Couldnt find the user");
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  },
  verifyEmail: async (req, res) => {
    try {
      const userEmail = req.query.email;
      const user = await usermodel.findOneAndUpdate(
        { email: userEmail },
        { $set: { verified: true } }
      );
      if (user) {
        console.log(user, "user");
        let token = generateToken(res, user._id);
        console.log(token, "token");
        res.status(200).json({
          _id: user._id,
          email: user.email,
          token,
        });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  },
  emailValidation:async(req,res)=>{
    try {
      console.log(req.query,process.env.API_KEY,'query')

      let data =await axios.get(`https://gamalogic.com/emailvrf/?emailid=${req.query.email}&apikey=${process.env.API_KEY}&speed_rank=0`)
      console.log(data.data.gamalogic_emailid_vrfy[0],'data')
      res.status(200).json(data.data.gamalogic_emailid_vrfy[0])
    } catch (error) {
      console.log(error)
      res.status(400).json(error)
    }
  }
};

export default Authentication;
