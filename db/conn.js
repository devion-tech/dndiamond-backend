import mongoose from 'mongoose';
import dotenv from "dotenv"

dotenv.config()
let live_url = process.env.LIVE_URL
let local_url = process.env.LOCAL_URL
mongoose.connect(live_url).then(() => {
    console.log('Connection succesfull!');
}).catch((error) => {
    console.log("not connect", error);
})