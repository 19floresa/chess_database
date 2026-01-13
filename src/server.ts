import app from "./app.ts"
import config from "./config/config.ts"

app.listen(config.port, () => console.log(`Server listening on port ${config.port}`))

// import { UserModel } from "./models/UserModel.ts";
// import { GameModel } from "./models/GameModel.ts";

// const dbUser = new UserModel()
// const dbGame = new GameModel()
// const start: string = Date()

// const id1 = await dbUser.createStoreEntry("user1", "password123", start)
// const id2 = await dbUser.createStoreEntry("user2", "password123", start)

// const end: string = Date()
// await dbGame.createStoreEntry(id1, id2, id1, start, end, "complete", [[ 0b001, 0b010, 0b011, 0b100 ]])