import postgres from "postgres"
import config from "../config/config.ts"


const sql = postgres({
    port: config.dbPort,
    database: config.dbName,
    username: config.dbUsername,
    password: config.dbPassword,
})

await sql`CREATE TABLE IF NOT EXISTS players( id           INTEGER     GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
                                              username     VARCHAR(64) NOT NULL, 
                                              password     VARCHAR(64) NOT NULL,
                                              time_created TIMESTAMP   NOT NULL
                                            );`

await sql`CREATE TABLE IF NOT EXISTS game_info( id         BIGINT      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                                game_steps BIT(3)[4][] NOT NULL
                                               );`

await sql`CREATE TABLE IF NOT EXISTS previous_games( game_info_id       BIGINT      REFERENCES game_info(id), 
                                                     player_id          INTEGER     REFERENCES players(id),
                                                     player_id_opponent INTEGER     REFERENCES players(id),
                                                     start_time         TIMESTAMP   NOT NULL,
                                                     end_time           TIMESTAMP   NOT NULL,
                                                     is_player_light    BOOLEAN     NOT NULL,
                                                     is_player_winner   BOOLEAN     NOT NULL,
                                                     game_status        VARCHAR(64) NOT NULL,
                                                     PRIMARY KEY(game_info_id, player_id)
                                                    );`

export default sql