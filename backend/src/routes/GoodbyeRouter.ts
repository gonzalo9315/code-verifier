import express, { Request, Response } from "express"
import { GoodbyeController } from "../controller/GoodbyeController"
import { LogInfo } from "../utils/logger"

const goodbyeRouter = express.Router()
goodbyeRouter.route('/')
    .get(async (req: Request, res: Response) => {
        const name: any = req?.query?.name
        LogInfo(`Query Params: ${name}`)
        const controller: GoodbyeController = new GoodbyeController()
        const response = await controller.getMessage(name)
        return res.json(response)
    })

export default goodbyeRouter
