import express, { Request, Response } from "express"
import cors from "cors"
import morgan from "morgan"
// import 'dotenv/config';

import routes from "./routes/index"

const app = express()

app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/", routes)
const startServer = async () => {
    try {
        app.listen(5000, () => {
            console.log("Server is running on port 5000")
        })
    } catch (error) {
        console.log("Failed to start the server", error)
    }
}
// console.log(`${process.env.TESTVAR}`)
startServer()