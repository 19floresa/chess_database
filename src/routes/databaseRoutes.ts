import { Router } from "express"
import storeUser from "../controllers/userController.ts"
import storeGame from "../controllers/gameController.ts"
import retrieveGameReplay from "../controllers/replayController.ts"

const router = Router()

router.post("/user", storeUser)
router.post("/game", storeGame)
router.post("/replay", retrieveGameReplay)

export default router