import sql from "../database/db.ts"

export interface playerEntry {
    username: string
    password: string
    time_created: string
}

export class UserModel
{
    readonly #columns = [ "username", "password", "time_created" ] as const

    async createStoreEntry(username: string, password: string, timeCreated: string): Promise<number>
    {
        const entry: playerEntry = this.createEntry(username, password, timeCreated)
        const playerId: number = await this.storeEntry(entry)
        return playerId
    }

    createEntry(username: string, password: string, time_created: string): playerEntry
    {
        const entry: playerEntry =
        {
            username,
            password,
            time_created,
        }
        return entry
    }

    async storeEntry(entry: playerEntry): Promise<number>
    {
        const columns = this.#columns
        const out = await sql`INSERT INTO players${sql(entry, columns)} returning id`
        return out[0]!.id
    }
}

export const userModel = new UserModel()

