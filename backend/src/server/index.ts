import express, { Request, Response } from 'express'
import cors from "cors"
import helmet from "helmet"
import rootRouter from "../routes"
import swaggerUi from 'swagger-ui-express'
import mongoose from 'mongoose'
import fileUpload from 'express-fileupload'
// import multer from 'multer'

// TODO HTTPS

const server = express()
server.use(express.static('public'))
mongoose.connect('mongodb://localhost:27017/intensivo_abril')
server.use(helmet())
server.use(cors())
server.use(express.json({ limit: '50mb' }))
server.use(express.urlencoded({ extended: true, limit: '50mb' }))
server.use(fileUpload());
// server.use(multer().array('data'))

server.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
        swaggerOptions: {
            url: "/swagger.json",
            explorer: true
        }
    })
)
server.use(
    '/api',
    rootRouter
)
server.get('/', (req: Request, res: Response) => {
    res.redirect('/api')
})

export default server
