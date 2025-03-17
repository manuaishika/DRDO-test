import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, TextField, Typography, Link, Paper } from '@mui/material';
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
      const response = await axios.post('https://drdo-backend-1.onrender.com/login', credentials);
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

      {/* Dummy Login Details (Styled using MUI) */}
      <Paper
        elevation={3}
        sx={{
          position: 'fixed',
          right: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(200, 200, 200, 0.3)',
          padding: 2,
          borderRadius: 2,
          boxShadow: 3,
          color: 'rgba(0, 0, 0, 0.5)',
          fontSize: '0.9rem',
          width: 220
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.6)' }}>
          Dummy Login Details
        </Typography>
        <Typography>👤 <strong>Phone Number:</strong> <br></br> +918826417060</Typography>
        <Typography>🔑 <strong>Password:</strong> <br></br> 123456</Typography>
      </Paper>
    </Box>
  );
};

export default Login;
