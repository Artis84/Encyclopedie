const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const functions = require("firebase-functions");
// const admin = require("firebase-admin");
// admin.initializeApp();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "src")));

const options = {
    root: path.join(__dirname, ".."),
};

app.get("/form", (req, res, next) => {
    const fileName = "src/form.html";
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
    const jsonData = fs.readFileSync(path.join(__dirname, "..", "data.json"), (err) => next(err));
    const dataObject = JSON.parse(jsonData);
    dataObject.push(req.body);
    const newData = JSON.stringify(dataObject);
    fs.writeFile(path.join(__dirname, "..", "data.json"), newData, (err) => {
        if (err) {
            res.status(500).json("An error as popped");
            return next(err);
        } else {
            console.log("Data saved successfully");
            res.status(200).json("Data saved successfully");
        }
    });
});

// app.listen(3000, (err) => {
//     if (err) console.log(err);
//     console.log("Server online at http://localhost:3000/");
// });

exports.app = functions.https.onRequest(app, (err) => {
    if (err) console.log(err);
});
