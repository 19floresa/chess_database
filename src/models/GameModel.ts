import sql from "../database/db.ts"

export interface previousGameEntry {
    game_info_id: number
    player_id: number
}

export interface gameInfoEntry {
    player_id_light: number
    player_id_dark: number
    player_id_winner: number
    start_time: string
    end_time: string
    game_status: string
    game_steps: [ string, string, string, string ][]
}

export class GameModel
{
    readonly #infoColumns = [ "player_id_light", "player_id_dark", "player_id_winner", "start_time",
                              "end_time",        "game_status",    "game_steps" ] as const
    readonly #prevColumns = [ "game_info_id", "player_id"  ] as const

    async createStoreEntry(idLight: number,
                           idDark: number,
                           idWinner: number,
                           start: string,
                           end: string,
                           status: string,
                           gameSteps: [ number, number, number, number ][]): Promise<void>
    {
        // Generate and store game information
        const infoEntries: gameInfoEntry = this.createInfoEntry(idLight, 
                                                                idDark, 
                                                                idWinner, 
                                                                start, 
                                                                end, 
                                                                status, 
                                                                gameSteps)
        const gameInfoId: number = await this.storeInfoEntry(infoEntries)
        
        // Generate and store Player game
        const prevEntries: previousGameEntry[] = 
        [
            this.createPreviousGameEntry(gameInfoId, idLight), // player 1 entry
            this.createPreviousGameEntry(gameInfoId, idDark)   // player 2 entry
        ]
        this.storePrevEntry(prevEntries)
    }

    async retrieveReplayEntry(playerId: number, gameInfoID: number)
    {

        const results = await sql.begin( async (sql): Promise<gameInfoEntry[]> =>
        {
            const games = await sql` SELECT game_info_id FROM previous_games 
                                     WHERE player_id=${playerId} AND game_info_id>${gameInfoID} 
                                     ORDER BY game_info_id DESC
                                     LIMIT 25;`
            const ids: number[] = []
            for (const game of games)
            {
                ids.push(game.game_info_id)
            }
            const rows = await sql<gameInfoEntry[]>` SELECT * FROM game_info 
                                    WHERE id IN ${sql(ids)}`
            return rows
        })

        console.log(results)

        return results.length !== 0 ? results : null
    }

    createPreviousGameEntry(game_info_id: number,
                            player_id: number): previousGameEntry
    {
        const entry: previousGameEntry =
        {
            game_info_id,
            player_id,
        }
        return entry
    }
    
    createInfoEntry(player_id_light: number,
                    player_id_dark: number,
                    player_id_winner: number,
                    start_time: string,
                    end_time: string,
                    game_status: string,
                    steps: [ number, number, number, number ][]): gameInfoEntry
    {
        const game_steps: [ string, string, string, string ][] = []
        for (const step of steps)
        {
            const gameStep = this.binaryEncoder(step)
            game_steps.push(gameStep)
        }
        
        const entry: gameInfoEntry =
        {
            player_id_light,
            player_id_dark,
            player_id_winner,
            start_time,
            end_time,
            game_status,
            game_steps,
        }
        return entry
    }

    async storeInfoEntry(entry: gameInfoEntry): Promise<number>
    {
        const columns = this.#infoColumns
        const out = await sql`INSERT INTO game_info${sql(entry, columns)} returning id`
        return out[0]!.id
    }

    async storePrevEntry(entries: previousGameEntry[]): Promise<void>
    {
        const columns = this.#prevColumns
        const results = await sql.begin( async sql =>
        {
            let output = []
            for (const entry of entries)
            {
                const out = await sql`INSERT INTO previous_games${sql(entry, columns)} returning game_info_id`
                output.push(out)
            }
            return output
        })
    }

    numberToBinary = (num: number) =>  num.toString(2).padStart(3, "0")
    binaryEncoder(step: [ number, number, number, number ]): [ string, string, string, string ]
    {
        const [ x, y, x2, y2 ] = step
        return  [ 
            this.numberToBinary(x),
            this.numberToBinary(y),
            this.numberToBinary(x2),
            this.numberToBinary(y2),
        ]
    }

    binaryToNumber = (b: string) => parseInt(b, 2)
    binaryDecoder(step: [ string, string, string, string ]): [ number, number, number, number ]
    {
        const [ x, y, x2, y2 ] = step
        return  [ 
            this.binaryToNumber(x),
            this.binaryToNumber(y),
            this.binaryToNumber(x2),
            this.binaryToNumber(y2),
        ]
    }
}

export const gameModel = new GameModel()
