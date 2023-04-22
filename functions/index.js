const express = require("express");
const fs = require("fs");
const cors = require("cors");
const functions = require("firebase-functions");
const errorHandler = require("./middleware/errorHandler");
const admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");
const serviceAccount = require("./encyclopedie-a9303-firebase-adminsdk-k3374-2461c4af81.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const app = express();
const storage = new Storage();
const bucket = storage.bucket("encyclopedie-a9303.appspot.com");

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get("/data", (req, res, next) => {
    // Get a reference to the file
    const fileName = "data.json";
    const file = bucket.file(fileName);

    // Read the contents of the file
    file.download((err, contents) => {
        if (err) {
            next(err);
        } else {
            // Send the contents of the file as the response
            res.send(contents);
        }
    });
});

app.post("/submit-form", (req, res, next) => {
    const fileName = "data.json";
    const file = bucket.file(fileName);

    // Create a read stream from the file reference
    const readStream = file.createReadStream().on("error", (err) => next(err));

    // Create a buffer to hold the file contents
    let fileContents = Buffer.from("");

    // Write the file contents to the buffer
    readStream.on("data", (chunk) => {
        fileContents = Buffer.concat([fileContents, chunk]);
    });

    // Parse the file contents as JSON and send the parsed object in the response
    readStream.on("end", () => {
        try {
            const data = JSON.parse(fileContents);
            data.push(req.body);
            const newData = JSON.stringify(data);
            file.save(newData, { contentType: "application/json" }, (err) => {
                if (err) {
                    next(err);
                }
                return res.status(200).json("File saved successfully");
            });
        } catch (err) {
            next(err);
        }
    });
});

app.use(errorHandler);
exports.app = functions.region("europe-west1").https.onRequest(app);
