import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, TextField, Typography, Link } from '@mui/material';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    aadharNumber: '',
    phoneNumber: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/signup', formData);
      navigate('/login'); // Redirect to login after successful signup
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };


  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h4" gutterBottom>Sign Up</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Full Name"
          margin="normal"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <TextField
          fullWidth
          label="Aadhar Number"
          margin="normal"
          required
          value={formData.aadharNumber}
          onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
        />
        <TextField
          fullWidth
          label="Phone Number"
          margin="normal"
          required
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
          Sign Up
        </Button>
      </form>
      <Typography sx={{ mt: 2 }}>
        Already have an account? <Link href="/login">Login here</Link>
      </Typography>
    </Box>
  );
};

export default Signup;