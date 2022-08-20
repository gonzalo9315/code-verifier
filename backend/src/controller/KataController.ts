import { Get, Post, Put, Query, Route, Tags } from "tsoa"
import { IKataController } from "./interfaces"
import * as Kata from "../domain/orm/Kata.orm"
import { LogSuccess, LogWarning } from "../utils/logger"
import { IKata } from "@/domain/interfaces/IKata.interfaces"

@Route("/api/katas")
@Tags("KataController")
export class KataController implements IKataController {
    /**
     * Endpoint to retreive the Katas in the collection "Katas" of DB
     * @param {string} id Id of Kata to retreive (optional)
     * @returns All katas or kata by ID
     */
    public async getKatas(@Query()page: number, @Query()limit: number, @Query()id: string): Promise<any> {
        let response: any = ''
        if (id) {
            LogSuccess(`[/api/katas/id] Get Kata By ID: ${id}`)
            response = await Kata.getKataByID(id)
        } else {
            LogSuccess(`[/api/katas] Get All Katas Request`)
            response = await Kata.getAllKatas(page, limit)
        }
        return response
    }

    public async createKata(@Query()kata: IKata): Promise<any> {
        let response: any = ''
        if (kata) {
            LogSuccess(`[/api/katas] Create New Kata: ${kata.name}`)
            await Kata.createKata(kata).then((r) => {
                LogSuccess(`[/api/katas] Created Kata: ${kata.name}`)
                response = {
                    message: `Kata created successs successfully: ${kata.name}`
                }
            })
        } else {
            LogWarning('[/api/katas] Register needs Kata Entity')
            response = {
                message: 'Kata Not Registered: Please, provide an Kata Entity to create one'
            }
        }
        return response
    }

    public async updateKata(@Query()id: string, @Query()data: any, creator: any,  roleUser: string): Promise<any> {
        let response: any = ''

        if (id) {
            LogSuccess(`[/api/katas/id] Update Kata By ID: ${id}`)
            await Kata.updateKataByID(id, data, creator, roleUser).then((r) => {
                response = {
                    message: `Kata with id ${id} updated successfully`,
                    kata: r
                }
            })
        } else {
            LogWarning('[/api/katas] Update Kata Request WITHOUT ID')
            response = {
                message: 'Please, provide an ID to update from database'
            }
        }
        return response
    }
    
    /**
     * Endpoint to delete the Kata in the collection "Katas" of DB
     * @param {string} id Id of Kata to delete
     * @returns Message informing if deletion was correct
     */
    public async deleteKata(@Query()id: string, creator: string, roleUser: string): Promise<any> {
        let response: any = ''
        
        if (id) {
            LogSuccess(`[/api/katas/id] Delete Kata By ID: ${id}`)
            await Kata.deleteKataByID(id, creator, roleUser).then((r) => {
                response = {
                    message: `Kata with id ${id} deleted successfully`
                }
            })
        } else {
            LogWarning('[/api/katas] Delete Kata Request WITHOUT ID')
            response = {
                message: 'Please, provide an ID to remove from database'
            }
        }
        return response
    }
    
    public async getKatasByLevel(@Query()page: number, limit: number, level: string): Promise<any> {
        try {
            return await Kata.getKatasByLevel(page, limit, level)
        } catch (error) {
            return { message: `Please, provide a Level to get Katas from database: ${error}` }
        }
    }
    
    public async getKatasRecently(page: number, limit: number): Promise<any> {
        try {
            return await Kata.getKatasRecently(page, limit)
        } catch (error) {
            return { message: `Get Katas error: ${error}` }
        }
    }

    public async getKatasByStars(page: number, limit: number, starts: number): Promise<any> {
        try {
            return await Kata.getKatasByStars(page, limit, starts)
        } catch (error) {
            return { message: `Get Katas error: ${error}` }
        }
    }

    public async updateKataStars(@Query()id: string, userName: string, stars: number): Promise<any> {
        try {
            await Kata.updateKataStarsByID(id, userName, stars)
            return { message: `Kata with id ${id} updated successfully` }
        } catch (error) {
            return { message: `Please, provide data to update from database: ${error}` }
        }
    }

    public async getKatasByChances(@Query()page: number, limit: number, chances: any): Promise<any> {
        try {
            return await Kata.getKatasByChances(page, limit, chances)
        } catch (error) {
            return { message: `Please, provide a chances to get Katas from database: ${error}` }
        }
    }

    public async resolveKata(@Query()id: string, userName: string, solution: string): Promise<any> {
        let response: any
        try {
            LogSuccess(`[/api/katas/resolve/id] Resolve Kata with ID: ${id}`)
            response = await Kata.resolveKataByID(id, userName, solution)
        } catch (error) {
            return { message: `Please, provide a solution to resolve Kata from database: ${error}` }
        }
        return response
    }

    @Post("/upload")
    public async uploadKataFile(): Promise<any> {
        throw new Error("Method not implemented.")
    }
}
