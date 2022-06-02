const express = require('express');
const {addStudent , getAllStudents , getStudent , updateStudent , deleteStudent , authMiddleWare} = require('../controllers/studentController');

const router = express.Router();

router.post('/student', authMiddleWare ,addStudent);

router.get('/students', getAllStudents);

router.get('/student/:id' , getStudent);

router.put('/student/:id', updateStudent);

router.delete('/student/:id', deleteStudent);

module.exports = {
    routes: router
}