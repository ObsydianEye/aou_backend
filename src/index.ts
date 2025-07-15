import express, { Request, Response } from "express"
import cors from "cors"
import morgan from "morgan"
import 'dotenv/config';

import envConfig from "./utils/envConfgi";
import { connectDB } from "./models/database";
import { errorHandler } from "./middlewares/errorhandler";
import routes from "./routes"

const app = express()

app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req: Request, res: Response) => { res.send("this is working") })
app.use("/api", routes)

app.use(errorHandler)

const startServer = async () => {
    try {
        await connectDB();
        app.listen(envConfig.PORT, () => {
            console.log(`🚀 Server running on port ${envConfig.PORT}`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
};
startServer()