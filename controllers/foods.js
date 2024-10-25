const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

// index page
router.get('/', async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        // console.log(user.pantry);
        // Look up the current user's pantry
        const userPantry = user.pantry
        // Send all pantry items to the view via res.locals
        res.locals.pantry = userPantry;
        // Render the view
        res.render('foods/index.ejs');
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// new page
router.get('/new', (req, res) => {
    res.render('foods/new.ejs')
});

// create post
router.post('/', async (req, res) => {
    try {
        // Look up the user from req.session
        const user = await User.findById(req.session.user._id)
        // Push req.body (the new form data object) to the pantry array of the current user
        user.pantry.push(req.body)
        // Save changes to the user
        user.save()
        // Redirect back to the application's index view
        res.redirect(`/users/${user._id}/foods`);
    } catch (error) {
        res.send(error);
        res.redirect('/');
    }
});

// delete
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

// edit page
router.get('/:itemId/edit', async (req, res) => {
    try {
        // Look up the user from req.session
        const user = await User.findById(req.session.user._id);
        // Find the current food from the id using req.params
        const foodItem = user.pantry.id(req.params.itemId);
        // res.send(foodItem);
        // This route should res.render() an edit.ejs view
        // Send the current food to the view via res.locals
        res.locals.food = foodItem;
        res.render('foods/edit.ejs');
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.put('/:itemId', async (req, res) => {
    try {
        // Find the user from req.session
        const user = await User.findById(req.session.user._id);
        // Find the current food from the id supplied by req.params
        const foodItem = user.pantry.id(req.params.itemId);
        // Use the .set() method, updating the current food to reflect the new form data on req.body
        foodItem.set(req.body);
        // Save the current user
        user.save();
        // Redirect to the index view
        res.redirect(`/users/${user._id}/foods`);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

module.exports = router;