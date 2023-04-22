const admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");
const storage = new Storage();
const bucket = storage.bucket("your-bucket-name");

admin.initializeApp();

exports.writeToFile = functions.https.onRequest((req, res) => {
    const fileName = "data.json";
    const file = bucket.file(fileName);

    file.save(JSON.stringify({ key: "value" }), { contentType: "application/json" }, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error writing to file");
        }

        return res.status(200).send("File saved successfully");
    });
});

app.post("/submit-form", (req, res, next) => {
    const jsonData = fs.readFileSync("data.json", (err) => next(err));
    const dataObject = JSON.parse(jsonData);
    dataObject.push(req.body);
    const newData = JSON.stringify(dataObject);

    const fileName = "data.json";
    const file = bucket.file(fileName);
    file.save(newData, { contentType: "application/json" }, (err) => {
        if (err) {
            next(err);
            return res.status(500).send("Error writing to file");
        }

        return res.status(200).send("File saved successfully");
    });
});

app.use(errorHandler);
exports.writeToFile = functions.region("europe-west1").https.onRequest(app);
