import { kataEntity } from "../entities/kata.entity"
import { LogError } from "../../utils/logger"
import mongoose from "mongoose"
import { IKata } from "../interfaces/IKata.interfaces"
import { userEntity } from "../entities/user.entity"
import { IUser } from "../interfaces/IUser.interfaces"

const kataModel = kataEntity()
const userModel = userEntity()
/**
 * Method to obtain all Katas from Collection "Katas" in Mongo Server
 */
export const getAllKatas = async (page: number, limit: number): Promise<any[] | undefined> => {
    try {
        const response: any = {}
        await kataModel.find({ isDeleted: false })
            // .select('name description level valoration chances')
            .limit(limit)
            .skip((page - 1) * limit)
            .exec().then((katas: IKata[]) => {
                response.katas = katas
            })
        await kataModel.countDocuments().then((total: number) => {
            response.totalPages = Math.ceil(total / limit)
            response.currentPage = page
        })
        return response
    } catch (error) {
        LogError(`[ORM ERROR]: Getting All Katas: ${error}`)
    }
}

// - Create Kata
export const createKata = async (kata: IKata): Promise<any | undefined> => {
    try {
        await userModel.findById(kata.creator).then(async (userFound: IUser) => {
            kata.creator = userFound.name
            return await kataModel.create(kata)
        }).catch((error) => {
            console.error(`[ERROR Updating in ORM]: ${error}`)
        })
    } catch (error) {
        LogError(`[ORM ERROR]: Creating Kata: ${error}`)
    }
}

// - Get Kata By ID
export const getKataByID = async (id: string): Promise<any | undefined> => {
    try {
        return await kataModel.findById(id)
    } catch (error) {
        LogError(`[ORM ERROR]: Getting Kata By ID: ${error}`)
    }
}

// - Update Kata By ID
export const updateKataByID = async (id: string, data: any, creator: any, roleUser: string) => {
    try {
        await kataModel.findById(id).then(async (kataFound: IKata) => {
            if (kataFound.creator != creator && roleUser == 'user') throw new Error("You are not creator of the Kata")
            return await kataModel.findByIdAndUpdate(id, data)
        }).catch((error) => {
            console.error(`[ERROR Updating in ORM]: ${error}`)
        })
    } catch (error) {
        LogError(`[ORM ERROR]: Updating Kata: ${error}`)
    }
}

// - Delete Kata By ID
export const deleteKataByID = async (id: string, creator: string, roleUser: string): Promise<any | undefined> => {
    try {
        // const creatorId = new mongoose.Types.ObjectId(creator)
        await kataModel.findById(id).then(async (kataFound: IKata) => {
            if (kataFound.creator.toString() != creator && roleUser == 'user') throw new Error("You are not creator of the Kata")
            return await kataModel.deleteOne({ _id: id })
        }).catch((error) => {
            console.error(`[ERROR deleting in ORM]: ${error}`)
        })
    } catch (error) {
        LogError(`[ORM ERROR]: Deleting Kata By ID: ${error}`)
    }
}

// - Get Katas By Difficulty Level
export const getKatasByLevel = async (page: number, limit: number, level: string): Promise<any | undefined> => {
    try {
        const response: any = {}
        await kataModel.find({ level: level, isDeleted: false })
            .select('name description level valoration chances')
            .limit(limit)
            .skip((page - 1) * limit)
            .exec().then((katas: IKata[]) => {
                response.katas = katas
            })
        await kataModel.countDocuments().then((total: number) => {
            response.totalPages = Math.ceil(total / limit)
            response.currentPage = page
        })
        return response
    } catch (error) {
        LogError(`[ORM ERROR]: Getting Katas by Difficulty: ${error}`)
    }
}

// - Get Five Katas More Recently
export const getKatasRecently = async (page: number, limit: number): Promise<any | undefined> => {
    try {
        const response: any = {}
        await kataModel.find({ isDeleted: false })
            .sort({ createdAt: -1 })
            .select('name description')
            .limit(limit)
            .skip((page - 1) * limit)
            .exec().then((katas: IKata[]) => {
                response.katas = katas
            })
        await kataModel.countDocuments().then((total: number) => {
            response.totalPages = Math.ceil(total / limit)
            response.currentPage = page
        })
        return response
    } catch (error) {
        LogError(`[ORM ERROR]: Getting Katas more recently: ${error}`)
    }
}

// - Get Katas By Valoration From Highest To Lowest
export const getKatasByStars = async (page: number, limit: number, stars: number): Promise<any | undefined> => {
    try {
        const response: any = {}
        await kataModel.find({ stars: stars, isDeleted: false })
            .sort({ stars: 1 })
            .select('name description stars')
            .limit(limit)
            .skip((page - 1) * limit)
            .exec().then((katas: IKata[]) => {
                response.katas = katas
            })
        await kataModel.countDocuments().then((total: number) => {
            response.totalPages = Math.ceil(total / limit)
            response.currentPage = page
        })
        return response
    } catch (error) {
        LogError(`[ORM ERROR]: Getting Katas By Stars: ${error}`)
    }
}

// - Update Kata Stars
export const updateKataStarsByID = async (id: string, userName: string, stars: number): Promise<any | undefined> => {
    let response: any = {}
    let avg = 0
    try {
        await kataModel.updateOne(
            {
                _id: id,
                starsUsers: { $elemMatch: { user: userName } }
            },
            {
                $set: { "starsUsers.$": { user: userName, stars } }
            })
            .then((result: any) => {
                if (result.modifiedCount == 0) {
                    kataModel.findByIdAndUpdate(
                        id,
                        { 
                            $push: { starsUsers: { user: userName, stars } } 
                        }, 
                        { 
                            new: true, runValidators: true 
                        })
                        .then(() => {
                            response = {
                                message: 'Score correctly'
                            }
                        })
                }
            }) 

        await kataModel.findById(id).then((kata: IKata) => {
            const voters = kata.starsUsers.length
            const ratings = {
                uno: kata.starsUsers.filter((el: any) => el.stars == 1).length,
                dos: kata.starsUsers.filter((el: any) => el.stars == 2).length,
                tres: kata.starsUsers.filter((el: any) => el.stars == 3).length,
                cuatro: kata.starsUsers.filter((el: any) => el.stars == 4).length,
                cinco: kata.starsUsers.filter((el: any) => el.stars == 5).length
            }
            const totalStars = ratings.uno + (2 * ratings.dos) + (3 * ratings.tres) + (4 * ratings.cuatro) + (5 * ratings.cinco)
            avg = Math.round((totalStars / voters) * 10) / 10
        })
        await kataModel.updateOne({ _id: id }, { stars: avg })
        
        return response
    } catch (error) {
        LogError(`[ORM ERROR]: Updating Kata Stars: ${error}`)
    }
}

// - Get Katas By Chances
export const getKatasByChances = async (page: number, limit: number, chances: number): Promise<any | undefined> => {
    try {
        const response: any = {}
        await kataModel.find({ chances: chances, isDeleted: false })
            .select('name description chances')
            .limit(limit)
            .skip((page - 1) * limit)
            .exec().then((katas: IKata[]) => {
                response.katas = katas
            })
        await kataModel.countDocuments().then((total: number) => {
            response.totalPages = Math.ceil(total / limit)
            response.currentPage = page
        })
        return response
    } catch (error) {
        LogError(`[ORM ERROR]: Getting Katas by Chances: ${error}`)
    }
}

// - Resolve Kata By ID
export const resolveKataByID = async (id: string, userName: string, solution: string): Promise<any | undefined> => {
    let response: any = {}
    try {
        await kataModel.updateOne(
            {
                _id: id,
                participants: { $elemMatch: { user: userName } }
            },
            {
                $set: { "participants.$": { user: userName, solution } }
            })
            .then((result: any) => {
                if (result.modifiedCount == 0) {
                    kataModel.findByIdAndUpdate(
                        id,
                        { 
                            $push: { participants: { user: userName, solution } } 
                        }, 
                        { 
                            new: true, runValidators: true 
                        })
                        .then(() => {
                            response = {
                                message: 'Solution sent correctly'
                            }
                        })
                }
            }) 
        return response
    } catch (error) {
        LogError(`[ORM ERROR]: Resolve kata: ${error}`)
    }
}
