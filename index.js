const express = require("express");
const fs = require("fs");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 10, 
  standardHeaders: true, // add the `RateLimit-*` headers to the response
  legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
});

const app = express();
app.use(express.json());

// Apply rate limiting middleware
app.use(limiter);

app.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
});

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

    const sanitizedState = state.replace(/[^a-zA-Z\s]/g, '').trim().toLowerCase();
    if (sanitizedState.length === 0) {
        return res.status(400).send({
            "message": "error",
            "data": "Invalid state parameter"
        });
    } 

    if (!/^[a-zA-Z\s]+$/.test(sanitizedState)) {
        return res.status(400).send({
            "message": "error",
            "data": "State parameter must contain only letters"
        })
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

app.all('/{*any}', (req, res, next) => {
    res.send({
        "message": "error",
        "data": "Unknown endpoint"
    })
});

app.listen(process.env.PORT || 5000, () => {
    console.log("Server is running on port 5000");
});

module.exports = app