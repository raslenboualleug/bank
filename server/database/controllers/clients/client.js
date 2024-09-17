const db = require('../../sequelize/index');
const Client = db.clients;

// Add a new client
const addClient = async (req, res) => {
  try {
    const { fullname, address, phoneNumber, email, cardNumber, CINFront, CINBack, birthday, gender } = req.body;

    const client = await Client.create({
      fullname,
      address,
      phoneNumber,
      email,
      cardNumber,
      CINFront,
      CINBack,
      birthday,
      gender,
    });

    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an existing client
const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, address, phoneNumber, email, cardNumber, CINFront, CINBack, birthday, gender } = req.body;

    const client = await Client.findByPk(id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    client.fullname = fullname || client.fullname;
    client.address = address || client.address;
    client.phoneNumber = phoneNumber || client.phoneNumber;
    client.email = email || client.email;
    client.cardNumber = cardNumber || client.cardNumber;
    client.CINFront = CINFront || client.CINFront;
    client.CINBack = CINBack || client.CINBack;
    client.birthday = birthday || client.birthday;
    client.gender = gender || client.gender;

    await client.save();

    res.status(200).json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a client by ID
const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findByPk(id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    await client.destroy();

    res.status(200).json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all clients
const getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.status(200).json(clients);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a client by card number
const getClientByCardNumber = async (req, res) => {
  try {
    const { cardNumber } = req.params;
    const client = await Client.findOne({ where: { cardNumber } });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.status(200).json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a client by name
const getClientByName = async (req, res) => {
  try {
    const { name } = req.params;
    const clients = await Client.findAll({
      where: {
        fullname: name,
      },
    });

    if (clients.length === 0) {
      return res.status(404).json({ error: 'No clients found with the given name' });
    }

    res.status(200).json(clients);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  addClient,
  updateClient,
  deleteClient,
  getAllClients,
  getClientByCardNumber,
  getClientByName,
};
