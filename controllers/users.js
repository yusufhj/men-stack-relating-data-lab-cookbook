const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

// get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.locals.users = users;
        res.render('users/index.ejs');
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

module.exports = router;