const express = require('express');
const { isLoggedIn } = require('../middleware/auth');
const journalController = require('../controllers/journalController');

const router = express.Router();

router.get('/', isLoggedIn, journalController.listJournals);
router.get('/new', isLoggedIn, journalController.showNewJournal);
router.post('/new', isLoggedIn, journalController.createJournal);
router.get('/edit/:id', isLoggedIn, journalController.showEditJournal);
router.post('/edit/:id', isLoggedIn, journalController.updateJournal);
router.get('/delete/:id', isLoggedIn, journalController.deleteJournal);
router.get('/search', isLoggedIn, journalController.searchJournals);

module.exports = router;
