const express = require('express');
const router = express.Router();
const archiveController = require('../../controllers/archive//archive');

// Route to add a new archive
router.post('/', archiveController.addArchive);

// Route to delete an existing archive by ID
router.delete('/:id', archiveController.deleteArchive);

// Route to update an existing archive by ID
router.put('/:id', archiveController.updateArchive);

// Route to get all archives for a specific client
router.get('/client/:clientId', archiveController.getArchivesByClientId);

module.exports = router;
