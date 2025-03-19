const express = require('express');
const router = express.Router();

const isAuth = require('../middleware/is-auth')
const requestController = require('../controllers/request');

router.get('/users', isAuth, requestController.getUsers);

router.post('/send-request/:id', isAuth, requestController.sendRequest);

router.patch('/request/:id', isAuth, requestController.updateRequestStatus);

router.get('/followers/:username', requestController.getFollowers)

module.exports = router;