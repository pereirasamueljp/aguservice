export interface NewUser {
    id?: number,
    email: string,
    credentials: string,
    name?: string,
    lastName?: string,
    admin?: boolean,
}