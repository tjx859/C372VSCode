const express = require('express');
const { isAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.get('/dashboard', isAdmin, adminController.showDashboard);
router.get('/users', isAdmin, adminController.listUsers);
router.get('/users/:id', isAdmin, adminController.showUserDetails);
router.get('/users/delete/:id', isAdmin, adminController.deleteUser);

module.exports = router;
