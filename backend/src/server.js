import database from "./db.js";
import app from "./app.js";
import logger from "./utils/logger.js";
import appEm from "./app-em.js";
import usersRepository from "./repositories/usersRepository.js";

async function start() {
    logger("system", "Your Node.js version is " + process.version);

    logger("system", "Initialing the Beholder Brain...");

    const users = await usersRepository.getActiveUsers();
    if(!users || !users.length) return logger("system", "No active users found!");

    logger("system", "starting the server apps...");

    app.listen(process.env.PORT, () => {
        logger("system", "App is listening at " + process.env.PORT);
    })

    appEm.init(users[0].id);
}

start();