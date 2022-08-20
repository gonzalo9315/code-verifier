import { AxiosRequestConfig } from "axios"
import axios from '../utils/config/axios.config'
import { User } from '../utils/types/User.types'

/**
 * Obtain all Users
 * @param {string} token auth of User 
 * @returns Users of the db
 */
 export const getAllUsers = (token: string, limit?: number, page?: number) => {
    
    const options: AxiosRequestConfig = { 
        headers: {
            'x-access-token': token
        },
        params: {
            limit,
            page
        }
    }
    return axios.get('/users', options)    
}


/**
 * Get User By ID
 * @param {string} token auth of User 
 * @param {string} id ID of User
 * @returns User found
 */
 export const getUserByID = (token: string, id: string) => {

    const options: AxiosRequestConfig = { 
        headers: {
            'x-access-token': token
        },
        params: {
            id
        }
    }
    return axios.delete('/users', options)  
}

/**
 * Update User By ID
 * @param {string} token auth of User 
 * @param {string} id ID of User
 * @returns User found
 */
 export const updateUserByID = (token: string, id: string, data: any) => {

    const options: AxiosRequestConfig = { 
        headers: {
            'x-access-token': token
        },
        params: {
            id
        }
    }
    return axios.put('/users', data, options)  
}

/**
 * Delete User By ID
 * @param {string} token auth of User 
 * @param {string} id ID of User
 * @returns User found
 */
 export const deleteUserByID = (token: string, id: string) => {

    const options: AxiosRequestConfig = { 
        headers: {
            'x-access-token': token
        },
        params: {
            id
        }
    }
    return axios.delete('/users', options)  
}