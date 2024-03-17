import express from 'express'
import path from 'path'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import connectDB from './config/db.js'
import loginroutes from './routes/route.js'

dotenv.config()

const port = process.env.PORT || 3000;

connectDB();

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(cors({
    origin: "*",
  }));

  
app.use('/api',loginroutes)


  const server = app.listen(port,()=>{
    console.log(`Server started on port ${port}`)
})