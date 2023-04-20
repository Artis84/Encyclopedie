const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const functions = require("firebase-functions");

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const options = {
    root: __dirname,
};

app.get("/data", (req, res, next) => {
    const fileName = "data.json";
    res.sendFile(fileName, options, (err) => {
        if (err) {
            return next(err);
        } else {
            console.log("Rooting to:", fileName);
        }
    });
});

app.post("/submit-form", (req, res, next) => {
    const jsonData = fs.readFileSync("data.json", (err) => next(err));
    const dataObject = JSON.parse(jsonData);
    dataObject.push(req.body);
    const newData = JSON.stringify(dataObject);
    fs.writeFile("data.json", newData, (err) => {
        if (err) {
            res.status(500).json("An error as popped");
            return next(err);
        } else {
            console.log("Data saved successfully");
            res.status(200).json("Data saved successfully");
        }
    });
});

exports.app = functions.region("europe-west1").https.onRequest(app, (err) => {
    if (err) console.log(err);
});
