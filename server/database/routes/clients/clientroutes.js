const express = require('express');
const router = express.Router();
const clientController = require('../../controllers/clients/client')


router.get('/clients/cardNumber/:cardNumber', clientController.getClientByCardNumber); // Route to get client by card number
router.get('/clients/name/:name', clientController.getClientByName);
router.post('/clients', clientController.addClient);
router.put('/clients/:id', clientController.updateClient);
router.delete('/clients/:id', clientController.deleteClient);
router.get('/clients', clientController.getAllClients);

module.exports = router;
