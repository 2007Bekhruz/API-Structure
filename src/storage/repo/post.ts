import { IPost } from '../../models/Post'

export interface PostRepo {
    find(query: Object): Promise<IPost[]>
    findOne(query: Object): Promise<any>
    create(payload: IPost): Promise<IPost>
    update(id: string, payload: IPost): Promise<IPost>
    findOneUpdate(query: Object): Promise<IPost>
    delete(id: string): Promise<IPost>
}