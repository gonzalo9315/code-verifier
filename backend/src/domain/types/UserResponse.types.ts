import { IUser } from "../interfaces/IUser.interfaces"

export type UserResponse = {
    users: IUser[],
    totalPages: number,
    currentPage: number
}
