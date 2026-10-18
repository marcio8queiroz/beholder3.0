import Beholder from "../beholder.js";

async function getMemory(req, res) {
    const memory = await Beholder.getInstance().getMemory();
    res.json(memory);
}

async function getBrain(req, res) {
    const brain = await Beholder.getInstance().getBrain();
    res.json(brain);
}

async function updateMemory(req, res) {
    const memoryKey = req.params.index;
    const [symbol, index, interval, ...extra] = memoryKey.split(":");

    if (!symbol || !index || extra.length || interval === "")
        return res.status(400).json({ error: "Invalid memory key." });

    if (!req.body || !Object.hasOwn(req.body, "data") || req.body.data == null)
        return res.status(400).json({ error: "Body must contain a non-null data field." });

    const value = req.body.data;

    let results = await Beholder.getInstance().updateMemory(symbol, index, interval, value, true);
    if(results && results.length) results = results.filter(r => r);
    res.json(results);
}

export default {
    getMemory,
    getBrain,
    updateMemory
}
