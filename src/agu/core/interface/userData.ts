export interface UserData {
    id: number,
    email: string,
    hash: string,
    name?: string,
    lastName?: string,
    admin: boolean,
    active: boolean,
    deleted?: Date,
    altered: Date,
    created: Date,
}