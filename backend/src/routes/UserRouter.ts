import { LogInfo } from "../utils/logger"
import express, { Request, Response } from "express"
import { UserController } from "../controller/UserController"
import bodyParser from "body-parser"
import { verifyToken } from "../middlewares/verifyToken.middleware"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const jsonParser = bodyParser.json()
const controller = new UserController()
const UserRouter = express.Router()
UserRouter.route('/')
    .get(verifyToken, async (req: Request, res: Response) => {
        const id: any = req?.query?.id
        const page: any = req?.query?.page || 1
        const limit: any = req?.query?.limit || 10
        const response = await controller.getUsers(page, limit, id)
        return res.status(200).send(response)
    })
    .delete(verifyToken, async (req: Request, res: Response) => {
        const id: any = req?.query?.id
        const token: any = req.headers['x-access-token']
        const decoded: any = jwt.decode(token)
        const roleUser = decoded!.role
        const response = await controller.deleteUser(id, roleUser)
        return res.status(200).send(response)
    })
    .put(jsonParser, verifyToken, async (req: Request, res: Response) => {
        const id: any = req?.query?.id
        const name: any = req?.body?.name
        const email: any = req?.body?.email
        const password = bcrypt.hashSync(req.body?.password, 8)
        const age: any = req?.body?.age
        const role: any = req?.body?.role

        const data = {
            name,
            email,
            password,
            age,
            role
        }
        const response = await controller.updateUser(id, data)
        return res.status(200).send(response)
    })

UserRouter.route('/katas')
    .get(verifyToken, async (req: Request, res: Response) => {
        const id: any = req?.query?.id
        const page: any = req?.query?.page || 1
        const limit: any = req?.query?.limit || 10
        const response = await controller.getKatas(page, limit, id)
        return res.status(200).send(response)
    })

export default UserRouter
