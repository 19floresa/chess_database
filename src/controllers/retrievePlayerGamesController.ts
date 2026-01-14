import type { Request, Response } from "express"
import { gameModel } from "../models/GameModel.ts"

export default function retrievePlayerGames(req: Request, res: Response): void
{
    try
    {
        const body = req.body
        res.send({ message: "" })
    }
    catch(e)
    {
        res.status(400).json({ message: (e as Error).message })
    }
}