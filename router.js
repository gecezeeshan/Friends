const express = require('express');

const user = require('./user');

const router = express.Router();

router.get('/search/:userId/:query', user.search);

 router.get('/Friend/:userId/:friendId',user.Friend);

router.get('/getAllUser', user.getAllUser);

router.get('/getUserById/:userId', user.getUserById);

router.get('/unfriend/:userId/:friendId', user.unFriend);

router.get('/friend/:userId/:friendId', user.Friend);

module.exports = router;