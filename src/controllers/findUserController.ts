import type { Request, Response } from "express"
import { userModel } from "../models/UserModel.ts"

export default async function findUser(req: Request, res: Response): Promise<void>
{
    try
    {
        const { username } = req.body
        const playerId: number = await userModel.findPlayer(username)
        res.send({ message: "Player was found.", playerId })
    }
    catch(e)
    {
        res.status(400).json({ message: (e as Error).message })
    }
}