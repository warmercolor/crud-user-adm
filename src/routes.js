import { Router } from 'express'
import UserController from './controllers/UserController'
import UserMiddlewares from './middlewares/UserMiddleware'

const router = Router()

router.get('/users', UserMiddlewares.admin, UserController.index)
router.post('/login', UserController.token)
router.get('/users/profile', UserMiddlewares.authorization, UserController.show)
router.post('/users', UserController.store)
router.patch('/users/:id', UserMiddlewares.updateAuth, UserController.update)
router.delete('/users/:id', UserMiddlewares.updateAuth, UserController.delete)

export default router