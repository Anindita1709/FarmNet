import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cors from 'cors';
import auth from './routes/Auth.route.js';
const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO)
.then(() => {
  console.log('MongoDB is connected');
}).catch(err => {
  console.log(err);
})
app.listen(5000, () => {
  console.log("Server listening on port 5000");
});

//app.use('/api/auth', auth);  
