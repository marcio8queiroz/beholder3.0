import app from "./app.js";
import logger from "./utils/logger.js";

async function start() {
    logger("system", "Your Node.js version is " + process.version);

    logger("system", "Initialing the Beholder Brain...");

    logger("system", "No active users found!");

    logger("system", "starting the server apps...");

    app.listen(process.env.PORT, () => {
        logger("system", "App is listening at " + process.env.PORT);
    })
}

start();