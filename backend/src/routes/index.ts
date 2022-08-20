import express, { Request, Response } from "express"
import helloRouter from "./HelloRouter"
import { LogInfo } from "../utils/logger"
import goodbyeRouter from "./GoodbyeRouter"
import UserRouter from "./UserRouter"
import KataRouter from "./KataRouter"
import AuthRouter from "./AuthRouter"

const server = express()
const rootRouter = express.Router()

rootRouter.get('/', (req: Request, res: Response) => {
    LogInfo('GET: http://localhost:8000/api/')
    res.send('Welcome to my API Restful: Express + TS + Nodemon + Jest + Swagger + Mongoose')
})

server.use('/', rootRouter)
server.use('/hello', helloRouter)
server.use('/goodbye', goodbyeRouter)
server.use('/users', UserRouter)
server.use('/katas', KataRouter)
server.use('/auth', AuthRouter)

export default server
