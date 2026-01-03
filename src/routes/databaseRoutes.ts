import { Router } from "express"
import storeUser from "../controllers/userController.ts"
import storeGame from "../controllers/gameController.ts"
import retrieveReplay from "../controllers/replayController.ts"

const router = Router()

router.post("/user", storeUser)
router.post("/game", storeGame)
router.post("/replay", retrieveReplay)

export default router