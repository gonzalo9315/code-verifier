import { IKata } from "@/domain/interfaces/IKata.interfaces"
import { IUser } from "../../domain/interfaces/IUser.interfaces"
import { BasicResponse } from "../types"

export interface IHelloController {
    getMessage(name?:string): Promise<BasicResponse>
}

export interface IUserController {
    getUsers(page: number, limit: number, id?: string): Promise<any>
    getKatas(page: number, limit: number, id?: string): Promise<any>
    deleteUser(id: string, roleUser: string): Promise<any>
    updateUser(id: string, user: any): Promise<any>
}

export interface IKataController {
    getKatas(page: number, limit: number, id?: string): Promise<any>
    createKata(kata: IKata): Promise<any>
    updateKata(id: string, data: any, creator: any,roleUser: string): Promise<any>
    deleteKata(id: string, creator: string, roleUser: string): Promise<any>
    getKatasByLevel(page: number, limit: number, level: string): Promise<any>
    getKatasRecently(page: number, limit: number): Promise<any>
    getKatasByStars(page: number, limit: number, starts: number): Promise<any>
    updateKataStars(id: string, userName: string, stars: number): Promise<any>
    getKatasByChances(page: number, limit: number, chances: any): Promise<any>
    resolveKata(id: string, userName: string, solution: string): Promise<any>
    uploadKataFile(): Promise<any>
}

export interface IAuthController {
    registerUser(user: IUser): Promise<any>
    loginUser(auth: any): Promise<any>
}
