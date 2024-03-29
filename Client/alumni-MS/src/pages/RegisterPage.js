import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button, TextField, InputAdornment, Alert, IconButton, MenuItem, InputLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import Select from '@mui/material/Select';
import useResponsive from '../hooks/useResponsive';
// components
import Logo from '../components/logo';
import Iconify from '../components/iconify';
// sections
import { LoginForm } from '../sections/auth/login';
import { ENDPOINT } from './LoginPage';
import MyAlert from 'src/components/MyAlert';
import { getCities, getProvinces } from 'src/utils/states';
import batchData from 'src/data/batchData';
// ----------------------------------------------------------------------



function RegisterForm() {
    const navigate = useNavigate();
    const [succ, setSucc] = useState(false)
    const [phone, setPhone] = useState('+91')
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        batch: '',
        country: '',
        state: '',
        city: '',
        phone_num: '',

    })
    const [newData, setNewData] = useState('student')
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [provinces, setProvinces] = useState([])
    const [cities, setCities] = useState([])
    useMemo(() => {
        setProvinces(getProvinces())
    }, [])

    useEffect(() => {
        if (formData?.country) {
            setCities(getCities(formData.country))
        }
    }, [formData?.country])

    const handleClick = async (e) => {

        e.preventDefault();
        if (formData.email === '' || formData.password === '') {
            setIsError(true);
            setErrorMessage('Password and Email are Required');
            return;
        } if (formData.first_name === '') {
            setIsError(true);
            setErrorMessage('Name is Required');
            return;
        }

        const req = await fetch(`${ENDPOINT}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newData === 'admin' ? {
                ...formData,
                is_alumni: false,
                is_student: false,
                is_admin: true,
            } : newData === 'alumni' ? {
                ...formData,
                is_alumni: true,
                is_student: false,
                is_admin: false,
            } : {
                ...formData,
                is_alumni: false,
                is_student: true,
                is_admin: false,
            })
        });

        const data = await req.json();
        if (!req.ok) {
            setIsError(true);
            setErrorMessage(data.error);
            return;
        }
        setSucc(true)
    };

    const HandlePhoneChange = (e) => {
        if (e.target.value.length < 3) return
        if (e.target.value.length > 13) return
        if (isNaN(e.target.value)) return
        setPhone(e.target.value)
    }


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
                <TextField
                    name="First Name"
                    label="First Name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}

                />

                <TextField
                    name="Last Name"
                    label="Last Name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />

                <TextField
                    name="phone"
                    label="Phone Number"
                    value={phone}
                    onChange={HandlePhoneChange}
                />

                <InputLabel id="demo-simple-batch-label">Batch</InputLabel>
                <Select
                    labelId="demo-simple-batch-label"
                    id="demo-simple-select"
                    value={formData.batch}
                    label="Batch"
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                >
                    {
                        batchData.map((item, key) => (
                            <MenuItem value={item.value} key={key}>{item.title}</MenuItem>
                        ))
                    }
                </Select>
                <InputLabel id="demo-simple-select-label">Country</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={formData.country}
                    label="Country"
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                >
                    {
                        provinces.map((item, key) => (
                            <MenuItem value={item} key={key}>{item}</MenuItem>
                        ))
                    }
                </Select>
                <InputLabel id="demo-simple-select-label-city">City</InputLabel>
                <Select
                    sx={{ mt: 0 }}
                    labelId="demo-simple-select-label-city"
                    id="demo-simple-select-city"
                    value={formData.city}
                    label="city"
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                >
                    {cities &&
                        cities.map((item, key) => (
                            <MenuItem value={item} key={key}>{item}</MenuItem>
                        ))
                    }
                </Select>

                <Select
                    label="Register As"
                    value={newData}
                    onChange={(e) => setNewData(e.target.value)}
                >
                    <em>Register As</em>
                    <MenuItem value='student'>Student</MenuItem>
                    <MenuItem value='alumni'>Alumni</MenuItem>
                </Select>

                {isError && <MyAlert severity="error">{errorMessage}</MyAlert>}
                {succ && <MyAlert severity="success">Registration Successful You May Login</MyAlert>}
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
                <Link variant="subtitle2" underline="hover" onClick={() => navigate('/login')}>
                    Already Have an Account?
                </Link>
            </Stack>

            <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
                Register
            </LoadingButton>
        </>
    );
}

const StyledRoot = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));

const StyledSection = styled('div')(({ theme }) => ({
    width: '100%',
    maxWidth: 480,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxShadow: theme.customShadows.card,
    backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function RegisterPage() {
    const mdUp = useResponsive('up', 'md');

    return (
        <>
            <Helmet>
                <title> Register | Alumni Management System </title>
            </Helmet>

            <StyledRoot>
                <Logo
                    sx={{
                        position: 'fixed',
                        top: { xs: 16, sm: 24, md: 40 },
                        left: { xs: 16, sm: 24, md: 40 },
                    }}
                />

                {mdUp && (
                    <StyledSection>
                        <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
                            Hello, Nice to  See you
                        </Typography>
                        <img src="/assets/illustrations/illustration_login.png" alt="login" />
                    </StyledSection>
                )}

                <Container maxWidth="sm">
                    <StyledContent>
                        <Typography variant="h4" gutterBottom>
                            Sign Up for Alumni Management System
                        </Typography>

                        {/* <Typography variant="body2" sx={{ mb: 5 }}>
                            Don&apos;t have an account? {''}
                            <Link variant="subtitle2" to="/register">Get started</Link>
                        </Typography> */}

                        <RegisterForm />
                    </StyledContent>
                </Container>
            </StyledRoot>
        </>
    );
}
