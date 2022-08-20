import express, { query, Request, Response } from "express"
import { AuthController } from "../controller/AuthController"
import { IUser } from "../domain/interfaces/IUser.interfaces"
import bcrypt from "bcrypt"
import { IAuth } from "@/domain/interfaces/IAuth.interface"
import { verifyToken } from "../middlewares/verifyToken.middleware"
import bodyParser from "body-parser"
import jwt from "jsonwebtoken"

const jsonParser = bodyParser.json()
const AuthRouter = express.Router()
AuthRouter.route('/register')
    .post(jsonParser, async (req: Request, res: Response) => {
        const { name, password, email, age } = req?.body
        let hashedPassword = ''

        if (name && password && email && age) {
            hashedPassword = bcrypt.hashSync(req.body.password, 8)
            const user: IUser = {
                name,
                email,
                password: hashedPassword,
                age,
                katas: [],
                role: 'user'
            }
            const controller: AuthController = new AuthController()
            const response: any = await controller.registerUser(user)
            return res.status(200).send(response)
        } else {
            return res.status(400).send({
                message: '[ERROR User Data Missing!]: No user can be registered'
            })
        }
    })

AuthRouter.route('/login')
    .post(jsonParser, async (req: Request, res: Response) => {
        const { email, password } = req?.body
        const auth: IAuth = {
            email,
            password
        }
        if (email && password) {
            const controller: AuthController = new AuthController()
            const response: any = await controller.loginUser(auth)
            return res.status(200).send(response)
        } else {
            return res.status(400).send({
                message: '[ERROR User Data Missing!]: No user can be registeter'
            })
        }
    })

AuthRouter.route('/me')
    .get(jsonParser, verifyToken, async (req: Request, res: Response) => {
        const token: any = req.headers['x-access-token']
        const decoded: any = jwt.decode(token)
        const id: any = decoded!.id

        if (id) {
            const controller: AuthController = new AuthController()
            const response: any = await controller.userData(id)
            return res.status(200).send(response)
        } else {
            return res.status(401).send({
                message: 'You are not authorised to perform this action'
            })
        }
    })

export default AuthRouter
