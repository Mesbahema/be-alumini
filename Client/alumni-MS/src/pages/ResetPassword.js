import React, { useState } from 'react'

import { styled, Container, Box, Typography, Paper, TextField, Button } from '@mui/material'
import { ENDPOINT } from './LoginPage'
import MyAlert from 'src/components/MyAlert'
import { getQueryParam } from 'src/utils/queryParams'

const FormContainer = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
}))

const ResetPassword = () => {
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault()
        setIsError(false)
        setIsSuccess(false)
        const email = getQueryParam('email')
        const code = getQueryParam('code')
        const req = await fetch(`${ENDPOINT}/api/users/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password,
                email,
                code,
                passwordConfirm
            })
        });
        const data = await req.json();
        if (!req.ok) {
            setErrorMessage(data.error)
            setIsError(true);
            return;
        }
        setSuccessMessage(data.message)
        return setIsSuccess(true)
    }
    return (
        <Container maxWidth="sm">
            <FormContainer>
                <Paper component='form'
                    onSubmit={onSubmit}
                    elevation={3} sx={{ p: 5, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant='h4' fontWeight='bold' sx={{ mb: 5 }}>
                        please enter your new password
                    </Typography>
                    <TextField
                        name="password"
                        label="Password"
                        type="password"
                        value={password}
                        sx={{ mb: 5 }}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        name="password_confirm"
                        label="Password Confirm"
                        type="password"
                        value={passwordConfirm}
                        sx={{ mb: 5 }}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                    />
                    {isError && <MyAlert severity="error">{errorMessage}</MyAlert>}
                    {isSuccess && <MyAlert severity="success">{SuccessMessage}</MyAlert>}
                    <Button type='submit' variant="contained">Submit</Button>
                </Paper>
            </FormContainer>
        </Container>
    )
}

export default ResetPassword