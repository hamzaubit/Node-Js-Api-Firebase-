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

// app.get("/" , (req , res) => {
//     return res.send("Function is running...!!!");
// });

app.get('/Users' , (req , res) => {
  admin.firestore().collection("Users").get().then(users => {
    let tempUsers = [];
    users.forEach( user => {
      tempUsers.push(user.data())
    });
    res.status(200).json(tempUsers);
  });
});

app.post('/addUser' , (req , res) => {
  admin.firestore().collection('Users').add({
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "fatherName": req.body.fatherName,
        "classEnrolled": req.body.classEnrolled,
        "age": req.body.age,
        "phoneNumber": req.body.phoneNumber,
        "subject": req.body.subject,
        "year": req.body.year,
        "status": req.body.status
  }).then((user) => {
    res.status(200).json({message : `${user.id} added successfully... `});
  }).catch((err) => {
    res.send(err);
  });;
});


// CRON Jobs
exports.myScheduleFunction = functions.pubsub.schedule('30 10 * 1-12 0') // “At 10:30 on every day-of-month from 1 through 31 in every month from January through December.”
.onRun(() => {
  console.log("Schedule Function is Running...!!!");
});

//Trigger Function

exports.triggerFunction = functions.firestore.document('/{collection}/{id}')
.onCreate((snap , context) => {
  console.log(snap.data());
  const collection = context.params.collection;
  const id = context.params.id;

  const activities = admin.firestore.collection('activities');

  if(collection === 'Users'){
    return activities.add({text : 'User is Added'});
  }
  return null;
});

exports.app = functions.https.onRequest(app);
