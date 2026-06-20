// Authorized by Amit Makwana
import express from 'express';
import "./db/conn.js";
import cors from 'cors';
import dotenv from 'dotenv';
import index from './public/routes/index.js';
import bodyParser from 'body-parser';
import { createServer } from "http";
import { Server } from "socket.io";


dotenv.config()
const PORT = process.env.PORT
const app = express()
const server = createServer(app);
const io = new Server(server);

app.use(cors("*"))
app.use(bodyParser.json({ limit: '200mb' }))
// app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }))
app.use(express.json())

app.use("/api", index);

app.get("/", (req, res) => res.send("Ok"))

// http://localhost:8080/travelDateImage/image-1704030342110.jpg
app.use("/travelDateImage", express.static("image"))

app.get("/", (req, res, next) => {
    console.log('Live working perfectly');
})

io.on('connection', (socket) => {
    console.log('a user connected------------------------', socket);
});

server.listen(PORT, () => {
    console.log(`Connection is live at port not ${PORT}`);
})