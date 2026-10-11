import Beholder from "../beholder.js";

async function getMemory(req, res) {
    const memory = await Beholder.getInstance().getMemory();
    res.json(memory);
}

async function getBrain(req, res) {
    const brain = await Beholder.getInstance().getBrain();
    res.json(brain);
}

export default {
    getMemory,
    getBrain
}