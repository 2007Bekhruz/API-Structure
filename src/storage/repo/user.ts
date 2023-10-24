import { IUser } from '../../models/User'

export interface UserRepo {
    find(query: Object): Promise<IUser[]>
    findOne(query: Object): Promise<any>
    create(payload: IUser): Promise<IUser>
    update(id: string, payload: IUser): Promise<IUser>
    findOneUpdate(query: Object): Promise<IUser>
    delete(id: string): Promise<IUser>
}