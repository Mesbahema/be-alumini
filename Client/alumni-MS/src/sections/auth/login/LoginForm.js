import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { ENDPOINT } from 'src/pages/LoginPage';
import Iconify from '../../../components/iconify';
import MyAlert from 'src/components/MyAlert';
// ----------------------------------------------------------------------
// import { ENDPOINT } from '../../pages/LoginPage';


export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleClick = async (e) => {
    if (formData.email === '' || formData.password === '') {
      setIsError(true);
      setErrorMessage('Please fill in all fields');
      return;
    }
    e.preventDefault();
    const req = await fetch(`${ENDPOINT}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await req.json();
    if (!req.ok) {
      setIsError(true);
      setErrorMessage(data.error);
      return;
    }
    localStorage.setItem('token', data.token);
    navigate('/');
  };


  return (
    <>
      <Stack spacing={3}>
        <TextField name="email" label="Email address" type='email' value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        {isError && <MyAlert severity="error">{errorMessage}</MyAlert>}
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <RouterLink to='/otp'>
          <Link variant="subtitle2" underline="hover">
            Forgot password?
          </Link>
        </RouterLink>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Login
      </LoadingButton>
    </>
  );
}
