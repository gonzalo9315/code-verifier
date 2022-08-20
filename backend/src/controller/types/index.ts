export type BasicResponse = {
    message: string
}

export type ErrorResponse = {
    error: string,
    message: string
}

export type GoodbyeResponse = {
    message: string,
    Date: string
}

export type AuthResponse = {
    message: string,
    token: string,
    name: string,
    role: string
}
