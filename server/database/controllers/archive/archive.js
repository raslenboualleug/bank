// const { Archive } = require('../../models/archive/archive');

// Add a new archive


const db = require('../../sequelize/index');
const Archive = db.Archive;


const addArchive = async (req, res) => {
  try {
    const { clientId, fileName, filePath } = req.body;

    console.log(req.body);
    
    // Check if all required fields are provided
    if (!clientId || !fileName || !filePath) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    
    // Create a new archive record
    const newArchive = await Archive.create({
      clientId,
      fileName,
      filePath
    });

    res.status(201).json(newArchive);
  } catch (error) {
    console.error('Error adding archive:', error);
    res.status(500).json({ error: 'Error adding archive' });
  }
};
// Delete an existing archive
const deleteArchive = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the archive record
    const result = await Archive.destroy({ where: { id } });

    if (result === 0) {
      return res.status(404).json({ error: 'Archive not found' });
    }

    res.status(200).json({ message: 'Archive deleted successfully' });
  } catch (error) {
    console.error('Error deleting archive:', error);
    res.status(500).json({ error: 'Failed to delete archive' });
  }
};

// Update an existing archive
const updateArchive = async (req, res) => {
  try {
    const { id } = req.params;
    const { fileName, filePath } = req.body;

    // Find and update the archive record
    const [updated] = await Archive.update({ fileName, filePath }, { where: { id } });

    if (updated === 0) {
      return res.status(404).json({ error: 'Archive not found' });
    }

    const updatedArchive = await Archive.findByPk(id);

    res.status(200).json(updatedArchive);
  } catch (error) {
    console.error('Error updating archive:', error);
    res.status(500).json({ error: 'Failed to update archive' });
  }
};

// Get all archives by clientId
const getArchivesByClientId = async (req, res) => {
  try {
    const { clientId } = req.params;

    // Fetch archives associated with the clientId
    const archives = await Archive.findAll({ where: { clientId } });

    if (archives.length === 0) {
      return res.status(404).json({ error: 'No archives found for this client' });
    }

    res.status(200).json(archives);
  } catch (error) {
    console.error('Error fetching archives:', error);
    res.status(500).json({ error: 'Failed to fetch archives' });
  }
};

module.exports = {
  addArchive,
  deleteArchive,
  updateArchive,
  getArchivesByClientId
};
