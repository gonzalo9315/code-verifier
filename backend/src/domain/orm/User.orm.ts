import { userEntity } from "../entities/user.entity"
import { LogError } from "../../utils/logger"
import { IUser } from "../interfaces/IUser.interfaces"
import { IAuth } from "../interfaces/IAuth.interface"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
import { UserResponse } from "../types/UserResponse.types"
import { kataEntity } from "../entities/kata.entity"
import { IKata } from "../interfaces/IKata.interfaces"
import mongoose from "mongoose"

dotenv.config()
const secret = process.env.SECRETKEY || 'MYSECRETKEY'
/**
 * Method to obtain all Users from Collection "Users" in Mongo Server
 */
export const getAllUsers = async (page: number, limit: number): Promise<any[] | undefined> => {
    try {
        const userModel = userEntity()
        const response: any = {}
        await userModel.find({ isDeleted: false })
            .select('name email age role')
            .limit(limit)
            .skip((page - 1) * limit)
            .exec().then((users: IUser[]) => {
                response.users = users
            })
        await userModel.countDocuments().then((total: number) => {
            response.totalPages = Math.ceil(total / limit)
            response.currentPage = page
        })
        return response
    } catch (error) {
        LogError(`[ORM ERROR]: Getting All Users: ${error}`)
    }
}

// TODO
// - Get User By ID
export const getUserByID = async (id: string) : Promise<any | undefined > => {
    try {
        const userModel = userEntity()
        return await userModel.findById(id).select('name email age role')
    } catch (error) {
        LogError(`[ORM ERROR]: Getting User By ID: ${error}`)
    }
}
// - Delete User By ID
export const deleteUserByID = async (id: string, roleUser: string) : Promise<any | undefined > => {
    try {
        if(roleUser != 'admin') throw new Error("You do not have the necessary permissions")
        const userModel = userEntity()
        return await userModel.deleteOne({ _id: id })
    } catch (error) {
        LogError(`[ORM ERROR]: Deleting User By ID: ${error}`)
    }
}
// - Create New User
export const createUser = async (user: any) : Promise<any | undefined > => {
    try {
        const userModel = userEntity()
        return await userModel.create(user)
    } catch (error) {
        LogError(`[ORM ERROR]: Creating User: ${error}`)
    }
}
// - Update User By ID
export const updateUserByID = async (id: string, data: any) : Promise<any | undefined > => {
    try {
        const userModel = userEntity()
        return await userModel.findByIdAndUpdate(id, data)
    } catch (error) {
        LogError(`[ORM ERROR]: Updating User: ${error}`)
    }
}
// - Register User
export const registerUser = async (user: IUser) : Promise<any | undefined > => {
    try {
        const userModel = userEntity()
        return await userModel.create(user)
    } catch (error) {
        LogError(`[ORM ERROR]: Creating User: ${error}`)
    }
}

// - Login
export const loginUser = async (auth: IAuth) : Promise<any | undefined > => {
    try {
        const userModel = userEntity()
        let userFound: IUser | undefined
        let token
        let id
        await userModel.findOne({ email: auth.email }).then((user) => {
            userFound = user
            id = user.id
        }).catch((error) => {
            console.error(`[ERROR Authentication in ORM]: User Not Found`)
            throw new Error(`[ERROR Authentication in ORM]: User Not Found: ${error}`)
        })
        const validPassword = bcrypt.compareSync(auth.password, userFound!.password)
        if (!validPassword) {
            console.error(`[ERROR Authentication in ORM]: Password Not Valid`)
            throw new Error(`[ERROR Authentication in ORM]: Password Not Valid`)
        }
        token = jwt.sign({ id: id, name: userFound!.name, role: userFound!.role }, secret, {
            expiresIn: "3h"
        })
        return {
            user: userFound,
            token
        }
    } catch (error) {
        LogError(`[ORM ERROR]: Getting User By ID: ${error}`)
    }
}

export const getKatasFromUser = async (page: number, limit: number, id: string): Promise<any[] | undefined> => {
    try {
        const userModel = userEntity()
        const katasModel = kataEntity()
        let katasFound: IKata[] = []
        const response: any = {
            katas: []
        }
        await userModel.findById(id).then(async (user: IUser) => {
            response.user = user.email
            const objectIds: mongoose.Types.ObjectId[] = []
            user.katas.forEach((kataID: string) => {
                const objectId = new mongoose.Types.ObjectId(kataID)
                objectIds.push(objectId)
            })
            await katasModel.find({ _id: { $in: objectIds } }).then((katas: IKata[]) => {
                katasFound = katas
            })
        }).catch((error) => {
            LogError(`[ORM ERROR]: Obtaining User: ${error}`)
        })
        response.katas = katasFound
        return response
    } catch (error) {
        LogError(`[ORM ERROR]: Getting All Users: ${error}`)
    }
}
