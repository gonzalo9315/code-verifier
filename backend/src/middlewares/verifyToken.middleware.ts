import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import dotenv from "dotenv"

dotenv.config()
const secret = process.env.SECRETKEY || 'MYSECRETKEY'
/**
 *
 * @param { Request } req Original request previous middleware of verification JWT
 * @param { Response } res Response to verification of JWT
 * @param { NextFunction } next Next function to be executed
 * @returns Errors of verification or next execution
 */
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    let token: any = req.headers['x-access-token']
    if (!token) {
        return res.status(403).send({ 
            authentication: 'Missing JWT in request',
            message: 'Not authorised to consume this endpoint'
        })
    }
    jwt.verify(token, secret, (err: any, decoded: any) => {
        if (err) {
            return res.status(500).send({ 
                authentication: 'JWT verification failed',
                message: 'Failed to verifi JWT token in request'
            })
        }
        next()
    })
}
