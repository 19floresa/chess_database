import type { Request, Response } from "express"
import { gameModel } from "../models/GameModel.ts"

export default async function storeGame(req: Request, res: Response): Promise<void>
{
    try
    {
        const { idLight,
                idDark,
                idWinner,
                start,
                end,
                status,
                gameSteps } = req.body
        await gameModel.createStoreEntry(idLight, idDark, idWinner, start, end, status, gameSteps)
        res.send({ message: "Game successfully saved." })
    }
    catch(e)
    {
        res.status(400).json({ message: (e as Error).message })
    }
}