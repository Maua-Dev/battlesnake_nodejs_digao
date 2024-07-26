import { Router } from "express"
import { baseHandler } from "../handlers/base_handler"
import { startHandler } from "../handlers/start_handler"
import { moveHandler } from "../handlers/move_handler"

export const snakeRouter = Router()

snakeRouter.get('/', baseHandler)
snakeRouter.post('/start', startHandler)
snakeRouter.post('/move', moveHandler)