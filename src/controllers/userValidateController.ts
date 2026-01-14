import type { Request, Response } from "express"
import { userModel } from "../models/UserModel.ts"

export default async function validateUser(req: Request, res: Response): Promise<void>
{
    try
    {
        const { username, password } = req.body
        const entry = await userModel.retrieveEntry(username)
        if (entry !== null)
        {
            const testUsername = username === entry.username
            const testPassword = password === entry.password
            if (testUsername && testPassword)
            {
                res.send({ message: "User successfully retrieved.", id: entry.id })
            }
            else
            {
                throw Error("Username or password is incorrect.")
            }
        }
        else
        {
            throw Error("User does not exist.")
        }
    }
    catch(e)
    {
        res.status(400).json({ message: (e as Error).message })
    }
}