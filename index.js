const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

// Middleware to handle JSON parsing errors
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).send({
            "message": "error",
            "data": "Invalid JSON format"
        });
    }
    next();
});

app.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
});

// logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

let cachedData = {};
let dataFilePath = 'data/dragstrips.json';

function loadData() {
    try {
        const jsonString = fs.readFileSync(dataFilePath, 'utf8');
        cachedData = JSON.parse(jsonString);

    } catch (err) {
        console.error('Error reading or parsing file:', err);
        cachedData = {};
    }
}
loadData();

app.get("/", (req, res) => {
    if (Object.keys(cachedData).length > 0) {
        res.send({
            "message": "success",
            "data": cachedData
        });
    } else {
        res.send({
            "message": "success",
            "data": "No data found" 
        });
    }
});

app.get("/location", (req, res) => {
    const { state } = req.query;
    if (!state) {
        return res.status(400).send({
            "message": "error",
            "data": "State parameter is required"
        });
    }
    const dragstrips = cachedData.filter(strip => strip.state.toLowerCase() === state.toLowerCase());
    if (dragstrips.length > 0) {
        res.send({
            "message": "success",
            "state": state,
            "data": dragstrips[0].tracks
        });
    } else {
        res.send({
            "message": "error",
            "data": `No dragstrips found for ${state}`
        });
    }
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});

module.exports = app