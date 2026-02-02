import sql from "../database/db.ts"

type stepEncoded = [ string, string, string, string, string ]
type stepDecoded = [ number, number, number, number, number ]

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
    game_steps: stepEncoded[]
}

export interface sqlOut {
    id: number
    player_id_light: number
    player_id_dark: number
    player_id_winner: number
    start_time: string
    end_time: string
    game_status: string
    game_steps: stepEncoded[]
}

export interface gameInfoOut {
    gameId: number
    opponentName: string
    isLight: boolean
    isWinner: boolean
    status: string
    steps: stepDecoded[]
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
                           gameSteps: stepDecoded[]): Promise<void>
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

        const data = await sql.begin( async (sql): Promise<[ sqlOut[], any ]> =>
        {
            const games = await sql` SELECT game_info_id
                                     FROM previous_games 
                                     WHERE player_id=${playerId} AND game_info_id>${gameInfoID} 
                                     ORDER BY game_info_id ASC
                                     LIMIT 25;`
            const idGames: number[] = []
            for (const game of games)
            {
                idGames.push(game.game_info_id)
            }
            const rowsGameInfo = await sql<sqlOut[]>` SELECT * 
                                                      FROM game_info 
                                                      WHERE id IN ${sql(idGames)}`

            
            const idPlayersTemp: Record<number, number> = {}
            for (const row of rowsGameInfo)
            {
                const isLight = playerId === row.player_id_light
                const id = isLight ? row.player_id_dark : row.player_id_light
                idPlayersTemp[id] = id
            }

            const idPlayers = Object.keys(idPlayersTemp)
            const rowsUsername = await sql<{ id: number, username: string}[]>` 
                                            Select id, username 
                                            FROM players
                                            WHERE id IN ${sql(idPlayers)}`
            const users: Record<number, string> = {}
            for (const { id, username } of rowsUsername)
            {
                users[id] = username
            }

            return [ rowsGameInfo, users ]
        })

        const [ results, users ] = data
        const gameOut: gameInfoOut[] = []
        for (const result of results)
        {
            const { id, 
                    player_id_light, 
                    player_id_dark, 
                    player_id_winner, 
                    game_status, 
                    game_steps } = result

            const gameId:       number        = id
            const isLight:      boolean       = playerId === player_id_light
            const isWinner:     boolean       = playerId === player_id_winner
            const status:       string        = game_status
            const opponentId:   number        = isLight ? player_id_dark : player_id_light
            const opponentName: string        = users[opponentId]
            const steps:        stepDecoded[] = []
            for (const step of game_steps)
            {
                steps.push(this.binaryDecoder(step))
            }

            gameOut.push(
            { 
                gameId,
                opponentName,
                isLight,
                isWinner,
                status,
                steps
            })
        }

        return gameOut
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
                    steps: stepDecoded[]): gameInfoEntry
    {
        const game_steps: stepEncoded[] = []
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
        const out = await sql<{ id: number }[]>`INSERT INTO game_info${sql(entry, columns)} returning id`
        return out[0]!.id
    }

    async storePrevEntry(entries: previousGameEntry[]): Promise<void>
    {
        const columns = this.#prevColumns
        const results = await sql<{ game_info_id: number }[]>`INSERT INTO previous_games${sql(entries, columns)} returning game_info_id;`
        //console.log(results)

    }

    numberToBinary = (num: number) =>  num.toString(2).padStart(3, "0")
    binaryEncoder(step: stepDecoded): stepEncoded
    {
        const [ x, y, x2, y2, promote ] = step
        return  [ 
            this.numberToBinary(x),
            this.numberToBinary(y),
            this.numberToBinary(x2),
            this.numberToBinary(y2),
            this.numberToBinary(promote),
        ]
    }

    binaryToNumber = (b: string) => parseInt(b, 2)
    binaryDecoder(step: stepEncoded): stepDecoded
    {
        const [ x, y, x2, y2, promote ] = step
        return  [ 
            this.binaryToNumber(x),
            this.binaryToNumber(y),
            this.binaryToNumber(x2),
            this.binaryToNumber(y2),
            this.binaryToNumber(promote),
        ]
    }
}

export const gameModel = new GameModel()
