import { IComment } from '../../models/Comment'

export interface CommentRepo {
    find(query: Object): Promise<IComment[]>
    findOne(query: Object): Promise<IComment>
    create(payload: IComment): Promise<IComment>
    update(id: string, payload: IComment): Promise<IComment>
    findOneUpdate(query: Object): Promise<IComment>
    delete(id: string): Promise<IComment>
}