import { Get, Post, Put, Query, Route, Tags } from "tsoa"
import { IAuthController } from "./interfaces"
import { LogSuccess, LogError, LogWarning } from "../utils/logger"
import { IUser } from "../domain/interfaces/IUser.interfaces"
import { IAuth } from "../domain/interfaces/IAuth.interface"
import { registerUser, loginUser, getUserByID } from "../domain/orm/User.orm"
import { AuthResponse, ErrorResponse } from "./types"

@Route("/api/auth")
@Tags("User/Controller")
export class AuthController implements IAuthController {
    @Post('/register')
    public async registerUser (user: IUser): Promise<any> {
        let response: any = ''

        if (user) {
            LogSuccess(`[/api/auth/register] Register New User: ${user.email}`)
            await registerUser(user).then((r) => {
                LogSuccess(`[/api/auth/register] Created User: ${user.email}`)
                response = {
                    message: `User created successs successfully: ${user.email}`
                }
            })
        } else {
            LogWarning('[/api/users] Register needs User Entity')
            response = {
                message: 'User Not Registered: Please, provide an User Entity to create one'
            }
        }
        return response
    }

    @Post('/login')
    public async loginUser (auth: IAuth): Promise<any> {
        let response: AuthResponse | ErrorResponse | undefined

        try {
            LogSuccess(`[/api/auth/login] Login User: ${auth.email}`)
            const data = await loginUser(auth)
            response = {
                token: data.token,
                name: data.user.name,
                role: data.user.role,
                message: `Welcome, ${data.user.name}`
            }
        } catch (error) {
            response = {
                error: `[AUTH ERROR]: ${error}`,
                message: 'Invalid Credentials'
            }
        }
        // if (auth) {
        //     LogSuccess(`[/api/auth/login] Login User: ${auth.email}`)
        //     const data = await loginUser(auth)
        //     response = {
        //         token: data.token,
        //         name: data.user.name,
        //         role: data.user.role,
        //         message: `Welcome, ${data.user.name}`
        //     }
        // } else {
        //     LogWarning('[/api/users] Register needs Auth Entity (email && password)')
        //     response = {
        //         error: '[AUTH ERROR]: Email & Password are needed',
        //         message: 'Please, provide a email && password to login'
        //     }
        // }
        return response
    }

    /**
     * Endpoint to retreive the User in the collection "Users" of DB
     * Middleware: validate JWT
     * In header you must add the x-access-token with a walid JWT
     * @param {string} id Id of user to retreive
     * @returns message informing if deletion was correct
     */
    @Get('/me')
    public async userData(@Query()id: string): Promise<any> {
        let response: any = ''

        if (id) {
            LogSuccess(`[/api/users/id] Get User Data By ID: ${id}`)
            response = await getUserByID(id)
        }
        return response
    }
}
