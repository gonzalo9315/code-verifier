import { verifyToken } from "../middlewares/verifyToken.middleware"
import express, { Request, Response } from "express"
import { KataController } from "../controller/KataController"
import bodyParser, { json } from "body-parser"
import { IKata, KataLevel } from "../domain/interfaces/IKata.interfaces"
import jwt from "jsonwebtoken"
import { UploadedFile } from "express-fileupload"

const jsonParser = bodyParser.json()
const controller = new KataController()
const kataRouter = express.Router()
kataRouter.route('/')
    .get(verifyToken, async (req: Request, res: Response) => {
        const id: any = req?.query?.id
        const page: any = req?.query?.page || 1
        const limit: any = req?.query?.limit || 10
        const response = await controller.getKatas(page, limit, id)
        res.send(response)
    })
    .delete(verifyToken, async (req: Request, res: Response) => {
        const id: any = req.query.id
        const token: any = req.headers['x-access-token']
        const decoded: any = jwt.decode(token)
        const creator: any = decoded!.id
        let roleUser = decoded!.role
        const response = await controller.deleteKata(id, creator, roleUser)
        res.send(response)
    })
    .post(jsonParser, verifyToken, async (req: Request, res: Response) => {
        const token: any = req.headers['x-access-token']
        const decoded: any = jwt.decode(token)
        const kataReq = JSON.parse(req.body.kata)
        let name: string = kataReq.name
        let description: string = kataReq.description || ' '
        let level: KataLevel = kataReq.level || KataLevel.BASIC
        let intents: number = kataReq.intents || 0
        let stars: number = 0
        let creator: any = decoded!.id
        let solution: string = kataReq.solution || ' '
        let participants: string[] = kataReq.participants || []
        const files: UploadedFile | UploadedFile[] | undefined = req?.files?.files
        let nameFiles: string[] = []
        if(files != undefined) {
            Array.isArray(files) ? nameFiles = files.map((file: UploadedFile) => file.name) : nameFiles.push(files!.name)
        }

        if (name && description && level && intents >= 0 && stars >= 0 && creator && solution && participants.length >= 0) {
            const kata: IKata = {
                name,
                description,
                level,
                intents,
                stars,
                creator,
                solution,
                participants,
                starsUsers: [],
                nameFiles
            }
            const response = await controller.createKata(kata)
            if(files != undefined) {
                Array.isArray(files) ? files.map((file: UploadedFile) => file.mv("./uploads/" + file.name)) : files!.mv("./uploads/" + files!.name)
            }
            return res.status(201).send(response)
        } else {
            return res.status(400).send({
                message: '[ERROR] Creating Kata. You need to sen all attrs of Kata to create it'
            })
        }
    })
    .put(jsonParser, verifyToken, async (req: Request, res: Response) => {
        const id: any = req?.query?.id
        const token: any = req.headers['x-access-token']
        const decoded: any = jwt.decode(token)
        let name: string = req?.body?.name
        let description: string = req?.body?.description || ' '
        let level: KataLevel = req?.body?.level || KataLevel.BASIC
        let intents: number = req?.body?.intents || 0
        let creator: any = decoded!.name
        let solution: string = req?.body?.solution || ' '
        let participants: string[] = req?.body?.participants || []
        let roleUser = decoded!.role

        if (name && description && level && intents >= 0 && creator && solution && participants.length >= 0) {
            const data: any = {
                name,
                description,
                level,
                intents,
                solution,
                participants,
                starsUsers: []
            }
            const response = await controller.updateKata(id, data, creator, roleUser)
            return res.status(200).send(response)
        } else {
            return res.status(400).send({
                message: '[ERROR] Updating Kata. You need to sen all attrs of Kata to update it'
            })
        }
    })

kataRouter.route('/levels')
    .get(verifyToken, async (req: Request, res: Response) => {
        const level: any = req.query.level
        const page: any = req?.query?.page || 1
        const limit: any = req?.query?.limit || 10
        const response = await controller.getKatasByLevel(page, limit, level)
        res.send(response)
    })

kataRouter.route('/recentlies')
    .get(async (req: Request, res: Response) => {
        const page: any = req?.query?.page || 1
        const limit: any = req?.query?.limit || 10
        const response = await controller.getKatasRecently(page, limit)
        res.status(200).send(response)
    })

kataRouter.route('/stars')
    .get(verifyToken, async (req: Request, res: Response) => {
        const stars: any = req.query.stars
        const page: any = req?.query?.page || 1
        const limit: any = req?.query?.limit || 10
        const response = await controller.getKatasByStars(page, limit, stars)
        res.send(response)
    })
    .put(verifyToken, async (req: Request, res: Response) => {
        const id: any = req.query.id
        const token: any = req.headers['x-access-token']
        const decoded: any = jwt.decode(token)
        let userName: any = decoded!.name
        const stars = parseInt(req.body.stars, 10)
        const response = await controller.updateKataStars(id, userName, stars)
        res.send(response)
    })

kataRouter.route('/chances')
    .get(verifyToken, async (req: Request, res: Response) => {
        const chances = req.query.chances
        const page: any = req?.query?.page || 1
        const limit: any = req?.query?.limit || 10
        const response = await controller.getKatasByChances(page, limit, chances)
        res.send(response)
    })

kataRouter.route('/resolve')
    .post(jsonParser, verifyToken, async (req: Request, res: Response) => {
        const token: any = req.headers['x-access-token']
        const decoded: any = jwt.decode(token)
        const userName = decoded.name
        const id: any = req?.query?.id
        const solution = req?.body?.solution
        const response = await controller.resolveKata(id, userName, solution)
        res.send(response)
    })

kataRouter.route('/uploadFile')
    .post(jsonParser, async (req: Request, res: Response) => {
        const files: any = req?.files
        try {
            if (!files) {
              res.send({
                status: false,
                message: "There was no file found in request",
                payload: {},
              });
            } else {
              //Use the name of the input field (i.e. "file") to retrieve the uploaded file
              let file = files.file;
              console.log(file)
              //Use the mv() method to place the file in upload directory (i.e. "uploads")
              file.mv("./uploads/" + file.name);
              //send response
              res.send({
                status: true,
                message: "File was uploaded successfuly",
                payload: {
                  name: file.name,
                  mimetype: file.mimetype,
                  size: file.size,
                //   path: "/files/uploads/",
                //   url: "https://my-ftp-server.com/bjYJGFYgjfVGHVb",
                },
              });
            }
          } catch (err) {
            res.status(500).send({
              status: false,
              message: "Unexpected problem",
              payload: {},
            });
          }
    })

export default kataRouter
