import { IKata } from "./IKata.interfaces";

export interface IUser {
    name: string,
    email: string,
    password: string,
    age: Number,
    katas: string[],
    role: string
}
