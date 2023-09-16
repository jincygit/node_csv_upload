const express = require('express');
const router = express.Router();

const todoController = require('../controllers/todo_controller');

router.get('/home', todoController.home);

// router.get('/sign-up', usersController.signUp);
// router.get('/sign-in', usersController.signIn);


router.post('/create', todoController.create);
router.post('/delete', todoController.delete);

// router.post('/create-session', usersController.createSession);


module.exports = router;