import { AxiosRequestConfig } from 'axios'
import axios from '../utils/config/axios.config'
import { Kata } from '../utils/types/Kata.types'

/**
 * Create a new Kata
 * @param {string} token auth of User 
 * @param {Kata} kata new kata create of the user
 * @returns Kata created
 */
 export const createKata = (token: string, kata: any, files: any) => {
    const formData = new FormData();
    files.forEach((item: any) => {
        formData.append(`files`, item.file);
    })
    formData.append("kata", JSON.stringify(kata))
    const options: AxiosRequestConfig = { 
        headers: {
            // 'Content-Type': 'application/json',
            "Content-Type": "multipart/form-data",
            'x-access-token': token
        }
    }
    return axios.post('/katas', formData, options)  
}

/**
 * Obtain all Katas
 * @param {string} token auth of User 
 * @returns Katas of the db
 */
export const getAllKatas = (token: string, limit?: number, page?: number) => {
    
    const options: AxiosRequestConfig = { 
        headers: {
            'x-access-token': token
        },
        params: {
            limit,
            page
        }
    }
    return axios.get('/katas', options)    
}

/**
 * Obtain Kata found
 * @param {string} token auth of User 
 * @param {string} id ID of Kata
 * @returns Kata found
 */
export const getKataByID = (token: string, id: string) => {

    const options: AxiosRequestConfig = { 
        headers: {
            'x-access-token': token
        },
        params: {
            id
        }
    }
    return axios.get('/katas', options)  
}

/**
 * Update Kata By ID
 * @param {string} token auth of User 
 * @param {string} id ID of Kata
 * @returns Kata found
 */
 export const updateKataByID = (token: string, id: string, data: any) => {

    const options: AxiosRequestConfig = { 
        headers: {
            'x-access-token': token
        },
        params: {
            id
        }
    }
    return axios.put('/katas', data, options)  
}

/**
 * Delete Kata By ID
 * @param {string} token auth of User 
 * @param {string} id ID of Kata
 * @returns Kata found
 */
 export const deleteKataByID = (token: string, id: string) => {

    const options: AxiosRequestConfig = { 
        headers: {
            'x-access-token': token
        },
        params: {
            id
        }
    }
    return axios.delete('/katas', options)  
}

/**
 * Resolve Kata By ID
 * @param {string} token auth of User 
 * @param {string} id ID of Kata
 * @returns Kata found
 */
 export const resolveKataByID = (token: string, id: string, solution: string) => {

    const options: AxiosRequestConfig = { 
        headers: {
            'x-access-token': token
        },
        params: {
            id
        }
    }
    return axios.post('/katas/resolve', {solution}, options)  
}

/**
 * Score Kata By ID
 * @param {string} token auth of User 
 * @param {string} id ID of Kata
 * @returns Kata found
 */
 export const scoreKataByID = (token: string, id: string, stars: string) => {

    const options: AxiosRequestConfig = { 
        headers: {
            'x-access-token': token
        },
        params: {
            id
        }
    }
    return axios.put('/katas/stars', {stars}, options)  
}

/**
 * Obtain all Katas
 * @param {string} token auth of User 
 * @returns Katas of the db
 */
 export const getKatasRecentlies = (limit?: number, page?: number) => {
    
    const options: AxiosRequestConfig = { 
        params: {
            limit,
            page
        }
    }
    return axios.get('/katas/recentlies', options)    
}