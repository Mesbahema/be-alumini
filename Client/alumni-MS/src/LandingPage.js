import React, { useState, useEffect } from "react";
import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { Features } from "./components/features";
import { About } from "./components/about";
import { Services } from "./components/services";
import { Gallery } from "./components/gallery";
import { Testimonials } from "./components/testimonials";
import { Team } from "./components/Team";
import { Contact } from "./components/contact";
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import { Avatar, Box, Button, Container, Typography, styled } from "@mui/material";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const UpperLanding = styled('div')(({ theme }) => ({
  minHeight: '720px',
  display: 'grid',
  gridTemplateColumns: ' repeat(auto-fill, 50%)',
  justifyContent: 'space-between',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: 'repeat(auto-fill, 100%)',
  },
}))
const UpperImageContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-evenly'
}))
const UpperDetails = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
}))
const Dotted = styled('div')(({ theme }) => ({
  width: '350px',
  top: 0,
  zIndex: -1,
  height: '500px',
  backgroundImage: 'radial-gradient(gray 2px, transparent 0)',
  backgroundSize: '40px 40px',
  backgroundPosition: '-18px -18px',
  position: 'absolute',
  transform: 'rotate(10deg)'
}))
const LogoSection = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '250px',
  justifyContent: 'space-between'
}))
const BorderedAvatar = styled(Avatar)(({ theme }) => ({
  borderColor: 'black',
  borderStyle: 'solid',
  borderWidth: '1px'
}))
const UpperImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: 'auto',
  borderRadius: '16px 0 0 16px'
}))

const ExperiencSection = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: '100%',
}))
const LandingPage = () => {
  const [landingPageData, setLandingPageData] = useState({});
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  return (
    <Container maxWidth='lg' sx={{ p: 1 }}>
      <UpperLanding>
        <UpperImageContainer>
          <LogoSection>
            <img src='/assets/logo.svg' width='70px' height='auto' />
            <Typography variant="h4" fontWeight='bold'>
              AlumiConnect
            </Typography>
          </LogoSection>
          <Typography variant="h1" fontWeight='bold'>
            Take the Next Step in Your Career with AlumiConnect.
          </Typography>
          <Typography color='text.secondary'>
            Find career opportunities and build professional relationships through our alumni job search platform.
          </Typography>
          <ExperiencSection>
            <BorderedAvatar src="/assets/images/avatars/female-9.png" />
            <Box sx={{ ml: 3 }}>
              <Typography fontWeight="bold" sx={{ width: '400px' }}>
                “I got my first job offer through AlumiConnect. It was great to work for a company where my education was valued and my skills were appreciated.”
              </Typography>
              <Typography color="text.disabled">
                Gloria Cary
              </Typography>
            </Box>
          </ExperiencSection>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" sx={{ maxWidth: '130px' }}>Get Started</Button>
          </Box>
        </UpperImageContainer>
        <UpperDetails>
          <Dotted />
          <UpperImage src="/assets/images/landing/1.jpg" />
        </UpperDetails>
      </UpperLanding>
    </Container>
  );
};

export default LandingPage;
