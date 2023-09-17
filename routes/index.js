/** ------------------ IMPORTING PACKAGE ------------------ **/
const express = require('express');
const router = express.Router();
const multer = require('multer');


/** ------------------ IMPORTING CONTROLLERS ------------------ **/
const upload = multer({ dest: 'uploads/files'})


console.log('router loaded');


/** ------------------ MAKING ROUTES TO CONTROLLERS------------------ **/
router.use('/csv_upload', require('./csv_upload'));


/** ------------------ EXPORTING ROUTER ------------------ **/
module.exports = router;