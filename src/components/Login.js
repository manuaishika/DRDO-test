// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, TextField, Typography, Link } from '@mui/material';
import { useAuth } from './Authcontext';

const Login = () => {
  const [credentials, setCredentials] = useState({
    phoneNumber: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/login', credentials);
      login(response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h4" gutterBottom>Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Phone Number"
          margin="normal"
          required
          value={credentials.phoneNumber}
          onChange={(e) => setCredentials({ ...credentials, phoneNumber: e.target.value })}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          required
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        />
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
          Login
        </Button>
      </form>
      <Typography sx={{ mt: 2 }}>
        Don't have an account? <Link href="/signup">Sign up here</Link>
      </Typography>
    </Box>
  );
};

export default Login;