import type { Request, Response } from "express"
import { userModel } from "../models/UserModel.ts"

export default async function storeUser(req: Request, res: Response): Promise<void>
{
    try
    {
        const { username, password, time_created } = req.body
        const playerId: number = await userModel.createStoreEntry(username, password, time_created)
        res.send({ message: "User successfully saved.", playerId })
    }
    catch(e)
    {
        res.status(400).json({ message: (e as Error).message })
    }
}