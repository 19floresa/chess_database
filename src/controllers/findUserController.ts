import type { Request, Response } from "express"
import { userModel } from "../models/UserModel.ts"

export default async function findUser(req: Request, res: Response): Promise<void>
{
    try
    {
        const { playerId } = req.body
        await userModel.findPlayer(playerId)
        res.send({ message: "Player was found." })
    }
    catch(e)
    {
        res.status(400).json({ message: (e as Error).message })
    }
}