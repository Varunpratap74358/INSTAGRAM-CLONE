import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import userRoute from './routes/userRoute.js'
import postRoute from './routes/postRoute.js'
import messageRoute from './routes/messageRoute.js'
import { app, server } from './socket/socket.js'
import path from 'path'

dotenv.config()
// const app = express()
const port = process.env.PORT || 4000

const __dirname = path.resolve()

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
)

// routes setup
app.use('/api/v1/user', userRoute)
app.use('/api/v1/post', postRoute)
app.use('/api/v1/message', messageRoute)

// deploye
app.use(express.static(path.join(__dirname,"/Frontend/dist")))
app.get("*",(req,res)=>{
  res.sendFile(path.resolve(__dirname,"Frontend","dist","index.html"))
})
// db connection
mongoose
  .connect(process.env.MONGOURI)
  .then(() => console.log('DB is connected'))
  .catch((err) => console.log(err))

server.listen(port, () => {
  console.log(`Server is started on ${port}`)
})
