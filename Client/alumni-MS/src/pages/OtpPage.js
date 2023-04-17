import React, { useState } from 'react'

import { styled, Container, Box, Typography, Paper, TextField, Button } from '@mui/material'
import { ENDPOINT } from './LoginPage'
import MyAlert from 'src/components/MyAlert'

const FormContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column'
}))

const OtpPage = () => {
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault()
    setIsError(false)
    setIsSuccess(false)
    const req = await fetch(`${ENDPOINT}/api/users/otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    if (!req.ok) {
      setErrorMessage(req.error)
      setIsError(true);
      return;
    }

    return setIsSuccess(true)
  }
  return (
    <Container maxWidth="sm">
      <FormContainer>
        <Paper component='form' onSubmit={onSubmit} elevation={3} sx={{ p: 5, display: 'flex', flexDirection: 'column' }}>
          {!isSuccess && <>
            <Typography variant='h4' fontWeight='bold' sx={{ mb: 5 }}>
              please enter you email address
            </Typography>
            <TextField
              name="email"
              label="Email"
              value={email}
              sx={{ mb: 5 }}
              onChange={(e) => setEmail(e.target.value)}
            />
            {isError && <MyAlert severity="error">{errorMessage}</MyAlert>}
            <Button type='submit' variant="contained">Submit</Button></>}
            {
              isSuccess && 
                <Typography variant='h4' fontWeight='bold'>
              Verification email successfully sent
            </Typography>
              
            }
        </Paper>
      </FormContainer>
    </Container>
  )
}

export default OtpPage