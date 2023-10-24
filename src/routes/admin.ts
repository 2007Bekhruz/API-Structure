import { Router } from 'express'
import { AdminController } from '../controllers/admin'
import { AdminValidator } from '../validators/admin'
import { AuthMiddleware } from '../middleware/auth'

const router = Router({ mergeParams: true })
const controller = new AdminController()
const validator = new AdminValidator()
const middleware = new AuthMiddleware()

router.route('/owner').post(controller.createOwner)
// router.route('/all').get(middleware.auth(['owner']), controller.getAll)
// router
    // .route('/create')
    // .post(middleware.auth(['owner']), validator.create, controller.create)

router.route('/login').post(validator.login, controller.login)
router
    .route('/:id')
    .get(middleware.auth(['owner']), controller.getOne)
    .patch(
        middleware.auth(['owner']),
        validator.update,
        controller.update
    )
    .delete(middleware.auth(['owner']), controller.delete)



export default router
