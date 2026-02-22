import dotenv from "dotenv"

dotenv.config()

interface Config {
    port: number;
    nodeEnv: string;
    dbUsername: string,
    dbPassword: string,
    dbName: string
    dbPort: number,
}

const config: Config = {
    port: Number(process.env.PORT) || 3078,
    nodeEnv: process.env.NODE_ENV || "development",
    dbUsername: process.env.DATABASE_USERNAME || "",
    dbPassword: process.env.DATABASE_PASSWORD || "",
    dbName: process.env.DATABASE_NAME || "",
    dbPort: Number(process.env.DATABASE_PORT || 5432),
}

export default config