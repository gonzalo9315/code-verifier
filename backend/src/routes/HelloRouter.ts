import express, { Request, Response } from "express"
import { HelloController } from "../controller/HelloController"
import { LogInfo } from "../utils/logger"

const helloRouter = express.Router()
helloRouter.route('/')
    .get(async (req: Request, res: Response) => {
        const name: any = req?.query?.name
        LogInfo(`Query Params: ${name}`)
        const controller: HelloController = new HelloController()
        const response = await controller.getMessage(name)
        return res.send(response)
    })

export default helloRouter
