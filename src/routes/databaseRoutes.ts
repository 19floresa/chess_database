import { Router } from "express"
import storeUser from "../controllers/userController.ts"
import storeGame from "../controllers/gameController.ts"
import retrieveGameReplay from "../controllers/replayController.ts"
import validateUser from "../controllers/userValidateController.ts"
import retrievePlayerGames from "../controllers/retrievePlayerGamesController.ts"

const router = Router()

router.post("/user", storeUser)
router.post("/game", storeGame)
router.post("/replay", retrieveGameReplay)
router.post("/validate", validateUser)
router.post("/user/games", retrievePlayerGames)

export default router