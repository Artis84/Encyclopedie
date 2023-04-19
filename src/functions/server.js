const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const functions = require("firebase-functions");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "..")));
app.use(express.static(__dirname));

const options = {
    // root: path.join(__dirname, ".."),
    root: path.join(__dirname),
};

app.get("/form", (req, res, next) => {
    const fileName = "form.html";
    // const fileName = "form.html";
    res.sendFile(fileName, options, (err) => {
        if (err) {
            return next(err);
        } else {
            console.log("Rooting to:", fileName);
        }
    });
});

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
    // const jsonData = fs.readFileSync(path.join(__dirname, "..", "data.json"), (err) => next(err));
    const jsonData = fs.readFileSync("data.json", (err) => next(err));
    const dataObject = JSON.parse(jsonData);
    dataObject.push(req.body);
    const newData = JSON.stringify(dataObject);
    // fs.writeFile(path.join(__dirname, "..", "data.json"), newData, (err) => {
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
