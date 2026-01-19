import { Router } from "express"
import storeUser from "../controllers/userController.ts"
import storeGame from "../controllers/gameController.ts"
import retrieveGameReplay from "../controllers/replayController.ts"
import validateUser from "../controllers/userValidateController.ts"
import findUser from "../controllers/findUserController.ts"
const router = Router()

router.post("/user", storeUser)
router.post("/find", findUser)
router.post("/game", storeGame)
router.post("/replay", retrieveGameReplay)
router.post("/validate", validateUser)

export default router