'use strict';

const firebase = require('../db');
const Users = require('../models/student');
const firestore = firebase.firestore();

const adminEmail = "admin@gmail.com";

function authMiddleWare(req , res , next){
    let headers = req.headers;
    if(headers.email){
        let email = headers.email;
        if(email == adminEmail){
            next();
        }
        else{
            res.status(403).send("You cannot access the resource");
        }
    }
    else{
        res.status(403).send("You cannot access the resource");
    }
}

// async function idMiddleWare(req , res , next){
//         let headers = req.headers;
//         const id = headers.id;
//         //const id = req.params.id;
//         const student = await firestore.collection('Users').doc(id);
//         const data = await student.get().then((result) => {
//             if(headers.id){
//                 if( id == "mIa6HIRxhCkbuHbCQfcH"){
//                     next();
//                 }
//                 else{
//                     res.status(403).send("You cannot access the resource");
//                 }
//             }
//             else{
//                 res.status(403).send("You cannot access the resource");
//             }
//         }).catch((err) => {
//             res.send(err);
//         });;
// }

const addStudent = async (req, res ) => {
    try {
        const data = req.body;
        await firestore.collection('Users').doc().set(data);
        res.send('Record saved successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAllStudents = async (req, res ) => {
    console.log(req.body);
    try {
        const students = await firestore.collection('Users');
        const data = await students.get();
        const studentsArray = [];
        if(data.empty) {
            res.status(404).send('No Student record found');
        }else {
            data.forEach(doc => {
                const student = new Users(
                    doc.id,
                    doc.data().firstName,
                    doc.data().lastName,
                    doc.data().fatherName,
                    doc.data().classEnrolled,
                    doc.data().age,
                    doc.data().phoneNumber,
                    doc.data().subject,
                    doc.data().year,
                    doc.data().semester,
                    doc.data().status
                );
                studentsArray.push(student);
            });
            res.send(studentsArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getStudent = async (req, res ) => {
    try {
        const id = req.params.id;
        const student = await firestore.collection('Users').doc(id);
        const data = await student.get();
        if(!data.exists) {
            res.status(404).send('Student with the given ID not found');
        }else {
            res.send(data.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateStudent = async (req, res ) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const student =  await firestore.collection('Users').doc(id);
        await student.update(data);
        res.send('Student record updated successfuly');        
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteStudent = async (req, res ) => {
    try {
        const id = req.params.id;
        await firestore.collection('Users').doc(id).delete();
        res.send('Record deleted successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}


module.exports = {
    addStudent,
    getAllStudents,
    getStudent,
    updateStudent,
    deleteStudent,
    authMiddleWare
}