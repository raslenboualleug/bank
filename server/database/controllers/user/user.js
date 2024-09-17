const db = require('../../sequelize/index');
const User = db.user;

// User Sign-Up
const signUp = async (req, res) => {
  const { email, name, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const newUser = await User.create({
      email,
      name,
      password,
      role,
    });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email and password (plaintext comparison)
    const user = await User.findOne({ where: { email, password } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Respond with success
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    // Handle any unexpected errors
    res.status(500).json({ error: error.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  signUp,
  login,
  getAllUsers,
};
