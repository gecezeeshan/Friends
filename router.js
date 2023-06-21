const express = require('express');

const user = require('./user');

const router = express.Router();

router.get('/search/:userId/:query', user.search);

 router.get('/Friend/:userId/:friendId',user.Friend);

router.get('/allusers',user.allUsers);
router.get('/allFriendById/:query',user.allFriends);
router.get('/allFriends',user.allFriends);
router.get('/unfriend/:userId/:friendId',user.unfriend);

module.exports = router;