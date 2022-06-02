const functions = require("firebase-functions");

const admin = require('firebase-admin');

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://demoproject-af984-default-rtdb.firebaseio.com"
});

const express = require('express');
const cors = require('cors');

const app = express();

app.get("/" , (req , res) => {
    return res.send("Function is running...!!!");
});

exports.app = functions.https.onRequest(app);
