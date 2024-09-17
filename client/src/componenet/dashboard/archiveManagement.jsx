import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip, Collapse, InputAdornment,
  FormControl, Select, MenuItem, InputLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import Sidebar from './sidebar';

// Function to upload image to Cloudinary
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "raslen");
  try {
    const response = await axios.post("https://api.cloudinary.com/v1_1/dtyq6i57z/image/upload", formData);
    return response.data.secure_url;
  } catch (error) {
    console.error("Failed to upload image", error);
    throw new Error("Failed to upload image");
  }
};

const ArchiveManagement = () => {
  const [clients, setClients] = useState([]); // Ensure clients is initialized as an array
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [clientArchives, setClientArchives] = useState([]);
  const [expandedClient, setExpandedClient] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/clients');
        if (Array.isArray(response.data)) {
          setClients(response.data);
        } else {
          console.error('Unexpected API response format:', response.data);
          setClients([]);
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
        setClients([]);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      const fetchClientArchives = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/archives/${selectedClient.id}`);
          setClientArchives(response.data);
        } catch (error) {
          console.error('Error fetching client archives:', error);
        }
      };

      fetchClientArchives();
    } else {
      setClientArchives([]);
    }
  }, [selectedClient]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:3000/api/clients/cardNumber/${searchTerm}`);
      
      // Handle response as an object
      if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
        setClients([response.data]); // Wrap the single client object in an array
      } else if (Array.isArray(response.data)) {
        setClients(response.data);
      } else {
        console.error('Unexpected API response format:', response.data);
        setClients([]);
      }
    } catch (error) {
      console.error('Error searching for clients:', error);
      setClients([]);
    }
  };
  
  const handleAddArchive = async () => {
    if (!file || !fileName) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please provide a file and a file name.',
      });
      return;
    }

    try {
      const filePath = await uploadImage(file); 
      console.log('filePath', filePath);
      
      await axios.post('http://localhost:3000/api/archives', {
        clientId: selectedClient.id,
        fileName,
        filePath
      });
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Archive added successfully',
      });
      setOpenDialog(false);
      setClientArchives(prevArchives => [...prevArchives, { fileName, filePath }]);
    } catch (error) {
      console.error('Error adding archive:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed!',
        text: 'Failed to add archive',
      });
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0]?.name || '');
  };

  const handleClickOpen = (client) => {
    setSelectedClient(client);
    setExpandedClient(client.id);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedClient(null);
    setExpandedClient(null);
  };

  const handleExpandClick = (clientId) => {
    setExpandedClient(expandedClient === clientId ? null : clientId);
  };

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard__content">
        <div style={{ padding: '20px' }}>
          <h1 style={{ marginLeft: 260, marginBottom: 60 }}>{t('archive Management')}</h1>

          <FormControl style={{ marginBottom: '20px', width: 150, marginLeft: 160 }}>
            <Select value={i18n.language} onChange={handleLanguageChange}>
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="fr">Français</MenuItem>
            </Select>
          </FormControl>

          <form onSubmit={handleSearch} style={{ margin: '0 auto', maxWidth: 1200, marginLeft: 160 }}>
            <TextField
              label={t('Search by Card Number')}
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton type="submit">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </form>

          <TableContainer component={Paper} style={{ margin: '0 auto', maxWidth: 1200, marginLeft: 160 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('fullName')}</TableCell>
                  <TableCell>{t('email')}</TableCell>
                  <TableCell>{t('phoneNumber')}</TableCell>
                  <TableCell>{t('address')}</TableCell>
                  <TableCell>{t('cardNumber')}</TableCell>
                  <TableCell>{t('birthday')}</TableCell>
                  <TableCell>{t('gender')}</TableCell>
                  <TableCell>{t('actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clients.map((client) => (
                  <React.Fragment key={client.id}>
                    <TableRow>
                      <TableCell>{client.fullname}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.phoneNumber}</TableCell>
                      <TableCell>{client.address}</TableCell>
                      <TableCell>{client.cardNumber}</TableCell>
                      <TableCell>{client.birthday}</TableCell>
                      <TableCell>{client.gender}</TableCell>
                      <TableCell>
                        <Tooltip title={t('addArchive')}>
                          <IconButton color="primary" onClick={() => handleClickOpen(client)}>
                            <AddIcon />
                          </IconButton>
                        </Tooltip>
                        <IconButton onClick={() => handleExpandClick(client.id)}>
                          {expandedClient === client.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={8}>
                        <Collapse in={expandedClient === client.id}>
                          <div style={{ padding: '10px' }}>
                            <h3>{t('clientFiles')}</h3>
                            <ul>
                              {clientArchives.map((archive) => (
                                <li key={archive.filePath}>
                                  <a href={archive.filePath} target="_blank" rel="noopener noreferrer">
                                    {archive.fileName}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog open={openDialog} onClose={handleClose}>
            <DialogTitle>{t('addArchiveFor')} {selectedClient?.fullname}</DialogTitle>
            <DialogContent>
              <input type="file" onChange={handleFileChange} />
              <TextField
                label={t('fileName')}
                variant="outlined"
                fullWidth
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                style={{ marginTop: '10px' }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                {t('cancel')}
              </Button>
              <Button onClick={handleAddArchive} color="primary">
                {t('addArchive')}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ArchiveManagement;
