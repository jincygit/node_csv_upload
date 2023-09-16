const express = require('express');

const router = express.Router();
const friendship_controller = require('../controllers/friendship_controller');


router.post('/toggle', friendship_controller.togglefriendship);


module.exports = router;