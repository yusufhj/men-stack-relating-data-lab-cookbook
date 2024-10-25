const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

router.get('/', async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        // console.log(user.pantry);
        res.render('foods/index.ejs', { user });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.get('/new', (req, res) => {
    res.render('foods/new.ejs')
});

router.post('/', async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id)
        user.pantry.push(req.body)
        user.save()
        res.redirect(`/users/${user._id}/foods`);
    } catch (error) {
        res.send(error);
        res.redirect('/');
    }
});

router.delete('/:itemId', async (req, res) => {
    try {
        // Look up the user from req.session
        const user = await User.findById(req.session.user._id);
        // Use the .deleteOne() method to delete a food using the id supplied from req.params
        const foodId = req.params.itemId;
        user.pantry.id(foodId).deleteOne();
        // Save changes to the user
        user.save();
        // Redirect to the index view
        res.redirect(`/users/${user._id}/foods`);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

module.exports = router;