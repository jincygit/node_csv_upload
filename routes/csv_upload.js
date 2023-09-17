/** ------------------ IMPORTING PACKAGE ------------------ **/
const express = require('express');
const router = express.Router();
const multer = require('multer');


/** ------------------ IMPORTING CONTROLLERS ------------------ **/
const issuesController = require('../controllers/issues_controller');
const csvHomeController = require('../controllers/csv_home_controller');
const fileController = require('../controllers/file_controller');
const upload = multer({ dest: 'uploads/files'})


/** ------------------ MAKING ROUTES ------------------ **/
router.get('/home', csvHomeController.home);
router.post('/upload', upload.single('file') ,csvHomeController.upload);
// router.get('/details/:id', csvHomeController.view);
router.get('/details' , csvHomeController.showFile)
router.get('/delete/:id', csvHomeController.delete);



/** ------------------ EXPORTING ROUTER ------------------ **/
module.exports = router;