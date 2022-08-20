import { AxiosRequestConfig } from 'axios'
import axios from '../utils/config/axios.config'

/**
 * Login Method
 * @param {string} email Email to login a user
 * @param {string} password Password to login a user
 * @returns 
 */
export const login = (email: string, password: string) => {
    let body = {
        email,
        password
    }
    return axios.post('/auth/login', body)
}

/**
 * Register Method
 * @param {any} user Data of user
 * @returns 
 */
export const register = (user: any) => {
    return axios.post('/auth/register', user)
}

/**
 * Get Profile Info
 * @param {string} token auth of User 
 * @returns User found
 */
 export const getProfile = (token: string) => {

    const options: AxiosRequestConfig = { 
        headers: {
            'x-access-token': token
        }
    }
    return axios.get('/auth/me', options)  
}