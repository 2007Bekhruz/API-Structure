import { AdminStorage } from './mongo/admin'
import { UserStorage } from './mongo/user'
import { PostStorage } from './mongo/post'
import { CommenttStorage } from './mongo/comment'
interface IStorage {
    admin: AdminStorage,
    user: UserStorage,
    post: PostStorage,
    comment: CommenttStorage
}

export let storage: IStorage = {
    admin: new AdminStorage(),
    user: new UserStorage(),
    post: new PostStorage(),
    comment : new CommenttStorage()
}
