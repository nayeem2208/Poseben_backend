import usermodel from "../models/model.js";
import generateToken from "../utils/jwt.js";
import jwt from "jsonwebtoken";

const Authentication = {
  login: async (req, res) => {
    try {
        console.log(req.body,'body')
      const { email, password } = req.body;
      const user = await usermodel.findOne({ email });
      console.log(user,'user')
      if (user && (await user.matchPassword(password))) {
        let token = generateToken(res, user._id);
        console.log(token,'token')
        res.json({
          _id: user._id,
          email: user.email,
          token,
        });
      } else {
        res.status(401).json("Either the email or password is incorrect");
      }
    } catch (error) {
        console.log(error)
      res.status(400).json(error);
    }
  },
  registerUser: async (req, res) => {
      const { email, password } = req.body;
      
    try {
      let userExists = await usermodel.findOne({ email });

      if (userExists) {
        res.status(400).json({ message: "User already exists" });
      } else {
        userExists = await usermodel.create({
          email,
          password,
        });
      }
      let token = generateToken(res, userExists._id);
      console.log(token, "tokeeeeeeeeeeeeeeeeeeeeeeeeeeeen");
      res.status(201).json({
        _id: userExists._id,
        email: userExists.email,
        token,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Registration failed", error: error.message });
    }
  },
  googleLogin : async (req, res) => {
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
  googleAuth:async (req, res) => {
    try {
        console.log('hiiiiiii i m hrere')
      const token = req.body.credentialResponse.credential;
      const decode = jwt.decode(token);
      const {email, sub } = decode;
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
        console.log('user is not created')
        res.status(400).json("Couldnt find the user");
      }
    } catch (error) {
        console.log(error)
      res.status(400).json({ error });
    }
  }
};

export default Authentication;
