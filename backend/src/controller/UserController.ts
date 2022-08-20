import { Get, Post, Put, Query, Route, Tags } from "tsoa"
import { IUserController } from "./interfaces"
import { LogSuccess, LogError, LogWarning } from "../utils/logger"
import { deleteUserByID, getAllUsers, getUserByID, createUser, updateUserByID, getKatasFromUser } from "../domain/orm/User.orm"
import { BasicResponse } from "./types"

@Route("/api/users")
@Tags("User/Controller")
export class UserController implements IUserController {
    /**
     * Endpoint to retreive the Users in the collection "Users" of DB
     * @param {string} id Id of user to retreive (optional)
     * @returns All users or user by ID
     */
    public async getUsers(@Query()page: number, @Query()limit: number, @Query()id?: string): Promise<any> {
        let response: any = ''

        if (id) {
            LogSuccess(`[/api/users/id] Get User By ID: ${id}`)
            response = await getUserByID(id)
        } else {
            LogSuccess('[/api/users] Get All Users Request')
            response = await getAllUsers(page, limit)
        }
        return response
    }

    /**
     * Endpoint to delte the Users in the collection "Users" of DB
     */
    public async deleteUser(@Query()id: string, roleUser: string): Promise<any> {
        let response: any = ''

        if (id) {
            LogSuccess(`[/api/users/id] Delete User By ID: ${id}`)
            deleteUserByID(id, roleUser).then((r) => {
                response = {
                    message: `User with id ${id} deleted successfully`
                }
            })
        } else {
            LogWarning('[/api/users] Delete User Request WITHOUT ID')
            response = {
                message: 'Please, provide an ID to remove from database'
            }
        }
        return response
    }

    @Put("/")
    public async updateUser(@Query()id: string, data: any): Promise<any> {
        let response: any = ''

        if (id) {
            LogSuccess(`[/api/users/id] Update User By ID: ${id}`)
            updateUserByID(id, data).then((r) => {
                response = {
                    message: `User with id ${id} updated successfully`
                }
            })
        } else {
            LogWarning('[/api/users] Update User Request WITHOUT ID')
            response = {
                message: 'Please, provide an ID to update from database'
            }
        }
        return response
    }

    @Get("/katas")
    public async getKatas(@Query()page: number, @Query()limit: number, @Query()id: string): Promise<any> {
        let response: any = ''
        if (id) {
            LogSuccess(`[/api/users/katas] Get Katas from User By ID: ${id}`)
            response = await getKatasFromUser(page, limit, id)
        } else {
            LogSuccess('[/api/users/katas] Get All Katas whithout id')
            response = {
                message: 'ID from user is needed'
            }
        }
        return response
    }
}
