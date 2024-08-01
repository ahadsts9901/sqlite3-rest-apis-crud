import "dotenv/config"
import express from "express"
import morgan from "morgan"
import sqlite3 from "sqlite3"
import todoRoutes from "./routes/todo.mjs"

const app = express()

app.use(express.json())
app.use(morgan('dev'))

export const db = new sqlite3.Database('./database.db');

app.use("/api/v1", todoRoutes)

const PORT = process.env.PORT || 5002

app.listen(PORT, () => console.log(`server is running on port ${PORT}`))