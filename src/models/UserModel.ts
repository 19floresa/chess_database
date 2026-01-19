import sql from "../database/db.ts"

export interface playerEntry {
    username: string
    password: string
    time_created: string
}

export class UserModel
{
    readonly #setColumns = [ "username", "password", "time_created" ] as const
    readonly #retrieveColumns = [ "id", "username", "password" ] as const
    readonly #findColumns = [ "id" ] as const

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
        const columns = this.#setColumns
        const out = await sql`INSERT INTO players${sql(entry, columns)} returning id`
        return out[0]!.id
    }

    async retrieveEntry(username: string): Promise<{ username: string, password: string, id: number } | null >
    {
        const columns = this.#retrieveColumns
        const out = await sql`SELECT ${sql(columns)} FROM players WHERE username=${username};`
        if (out.length !== 0)
        {
            const { username, password, id } = out[0]!
            return { username, password, id }
        }
        return null
    }

    async findPlayer(id: number): Promise<void>
    {
        const columns = this.#findColumns
        const out = await sql< { id: number }[] >`SELECT ${sql(columns)} FROM players WHERE id=${id};`
        if (out.length === 0)
        {
            throw new Error("Player was not found.")
        }
    }
}

export const userModel = new UserModel()

