import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import {
  Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select,
  InputLabel, FormControl, IconButton, Typography, Avatar, Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Sidebar from '../sidebar';

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

const ClientTable = () => {
  const [clients, setClients] = useState([]);
  const [open, setOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    address: '',
    cardNumber: '',
    birthday: '',
    gender: '',
    CINFront: null,
    CINBack: null
  });
  const [editingClient, setEditingClient] = useState(null);
  const [selectedCINImage, setSelectedCINImage] = useState(null);
  const [isCINImageModalOpen, setIsCINImageModalOpen] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/clients');
        setClients(response.data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    fetchClients();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/api/clients/${id}`);
        setClients(clients.filter(client => client.id !== id));
        Swal.fire('Deleted!', 'The client has been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  };

  const handleSaveClient = async () => {
    const { CINFront, CINBack } = newClient;

    try {
      const CINFrontUrl = CINFront instanceof File ? await uploadImage(CINFront) : newClient.CINFront;
      const CINBackUrl = CINBack instanceof File ? await uploadImage(CINBack) : newClient.CINBack;

      const clientData = {
        ...newClient,
        CINFront: CINFrontUrl,
        CINBack: CINBackUrl
      };

      if (editingClient) {
        await axios.put(`http://localhost:3000/api/clients/${editingClient.id}`, clientData);
        Swal.fire('Success!', 'Client updated successfully.', 'success');
        setClients((prevClients) =>
          prevClients.map((client) =>
            client.id === editingClient.id ? { ...client, ...clientData } : client
          )
        );
      } else {
        const response = await axios.post('http://localhost:3000/api/clients', clientData);
        setClients([...clients, response.data]);
        Swal.fire('Success!', 'Client added successfully.', 'success');
      }

      setOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving client:', error);
      Swal.fire('Error!', 'There was an issue saving the client.', 'error');
    }
  };

  const handleEdit = (client) => {
    setNewClient({
      fullname: client.fullname,
      email: client.email,
      phoneNumber: client.phoneNumber,
      address: client.address,
      cardNumber: client.cardNumber,
      birthday: client.birthday,
      gender: client.gender,
      CINFront: client.CINFront,
      CINBack: client.CINBack
    });
    setEditingClient(client);
    setOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewClient({
      ...newClient,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setNewClient({
      ...newClient,
      [name]: files[0]
    });
  };

  const handleOpenDialog = () => {
    resetForm();
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const resetForm = () => {
    setNewClient({
      fullname: '',
      email: '',
      phoneNumber: '',
      address: '',
      cardNumber: '',
      birthday: '',
      gender: '',
      CINFront: null,
      CINBack: null
    });
    setEditingClient(null);
  };

  const handleClientNameClick = (CINFrontUrl) => {
    setSelectedCINImage(CINFrontUrl);
    setIsCINImageModalOpen(true);
  };

  const handleCloseCINImageModal = () => {
    setIsCINImageModalOpen(false);
    setSelectedCINImage(null);
  };

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (


    <div className="dashboard">
      
    <Sidebar />
    <div className="dashboard__content">
    <div style={{ padding: 20, textAlign: 'center', position: 'relative' ,border:24}}>
    <h1 style={{marginLeft:260, marginBottom:60}}>{t('Clent Management')}</h1>
      <FormControl style={{
        position: 'absolute',
        top: 20,
        right: 20,
        width: 150,
      }}>
        {/* <InputLabel id="language-select-label">{t('language')}</InputLabel> */}
        <Select
          labelId="language-select-label"
          value={i18n.language}
          onChange={handleLanguageChange}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="fr">Français</MenuItem>
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenDialog}
        style={{ marginBottom: 20, marginLeft: 'auto', marginRight: 'auto', display: 'block' }}
      >
        {t('addClient')}
      </Button>

      <TableContainer component={Paper} style={{ margin: '0 auto', maxWidth: 1200 ,marginLeft:160}}>
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
              <TableRow key={client.id}>
                <TableCell>
                  <Tooltip title="View CIN Front">
                    <Button onClick={() => handleClientNameClick(client.CINFront)}>
                      <Avatar alt={client.fullname} src={client.CINFront} />
                      <span style={{ marginLeft: 10 }}>{client.fullname}</span>
                    </Button>
                  </Tooltip>
                </TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phoneNumber}</TableCell>
                <TableCell>{client.address}</TableCell>
                <TableCell>{client.cardNumber}</TableCell>
                <TableCell>{client.birthday}</TableCell>
                <TableCell>{client.gender}</TableCell>
                <TableCell>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDelete(client.id)}
                    style={{ marginRight: 10 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(client)}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{editingClient ? t('editClient') : t('addClient')}</DialogTitle>
        <DialogContent>
          <TextField
            label={t('fullName')}
            name="fullname"
            value={newClient.fullname}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label={t('email')}
            name="email"
            value={newClient.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label={t('phoneNumber')}
            name="phoneNumber"
            value={newClient.phoneNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label={t('address')}
            name="address"
            value={newClient.address}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label={t('cardNumber')}
            name="cardNumber"
            value={newClient.cardNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label={t('birthday')}
            name="birthday"
            value={newClient.birthday}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>{t('gender')}</InputLabel>
            <Select
              name="gender"
              value={newClient.gender}
              onChange={handleChange}
            >
              <MenuItem value="male">{t('male')}</MenuItem>
              <MenuItem value="female">{t('female')}</MenuItem>
            </Select>
          </FormControl>

          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="upload-cin-front"
            type="file"
            name="CINFront"
            onChange={handleFileChange}
          />
          <label htmlFor="upload-cin-front">
            <Button variant="contained" component="span" color="primary">
              {t('uploadCINFront')}
            </Button>
          </label>

          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="upload-cin-back"
            type="file"
            name="CINBack"
            onChange={handleFileChange}
          />
          <label htmlFor="upload-cin-back">
            <Button variant="contained" component="span" color="primary">
              {t('uploadCINBack')}
            </Button>
          </label>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">{t('cancel')}</Button>
          <Button onClick={handleSaveClient} color="primary">{t('save')}</Button>
        </DialogActions>
      </Dialog>

      {isCINImageModalOpen && (
        <Dialog open={isCINImageModalOpen} onClose={handleCloseCINImageModal}>
          <DialogContent>
            <img src={selectedCINImage} alt="CIN Front" style={{ width: '100%' }} />
          </DialogContent>
        </Dialog>
      )}
    </div>
    </div>
    
  </div>
   
  );
};

export default ClientTable;
