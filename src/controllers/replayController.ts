import type { Request, Response } from "express"
import { gameModel } from "../models/GameModel.ts"

export default async function retrieveGameReplay(req: Request, res: Response): Promise<void>
{
    try
    {
        const { id } = req.body
        await gameModel.retrieveReplayEntry(id, 0)
        res.send({ message: "" })
    }
    catch(e)
    {
        res.status(400).json({ message: (e as Error).message })
    }
   
}