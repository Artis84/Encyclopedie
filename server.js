const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "src")));

const options = {
    root: path.join(__dirname, "src"),
};

app.get("/form", (req, res) => {
    const fileName = "form.html";
    res.sendFile(fileName, options, (err) => {
        if (err) {
            next(err);
        } else {
            console.log("Root to:", fileName);
        }
    });
});

app.get("/data", (req, res) => {
    const fileName = __dirname + "/data.json";
    res.sendFile(fileName, (err) => {
        if (err) {
            next(err);
        } else {
            console.log("Root to:", fileName);
        }
    });
});

app.post("/submit-form", (req, res) => {
    const jsonData = fs.readFileSync("data.json", (err) => next(err));
    const dataObject = JSON.parse(jsonData);
    dataObject.push(req.body);
    const newData = JSON.stringify(dataObject);
    fs.writeFile("data.json", newData, (err) => {
        if (err) {
            res.status(500).json("An error as popped");
            next(err);
        } else {
            console.log("Data saved successfully");
            res.status(200).json("Data saved successfully");
        }
    });
});

app.listen(3000, (err) => {
    if (err) console.log(err);
    console.log("Server online at http://localhost:3000/");
});
