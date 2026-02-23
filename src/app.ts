import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

import databaseRoutes from "./routes/databaseRoutes.ts"
import { errorHandler } from "./middleware/errorHandler.ts"

const app = express()

app.use(cors({
    origin: '*',//['http://player:3025', 'http://game:3056'],
    methods: ['GET', 'POST',/* 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'*/],
    allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
}))

app.use(express.json())
app.use(cookieParser())

// Routes
app.use("/database", databaseRoutes)

// Error Handling
app.use(errorHandler)

export default app