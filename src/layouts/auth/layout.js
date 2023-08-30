import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { Box, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { Logo } from 'src/components/logo';

// TODO: Change subtitle text

export const Layout = (props) => {
  const { children } = props;

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flex: '1 1 auto'
      }}
    >
      <Grid
        container
        sx={{ flex: '1 1 auto' }}
      >
        <Grid
          xs={12}
          lg={6}
          sx={{
            backgroundColor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}
        >
          <Box
            component="header"
            sx={{
              left: 0,
              p: 3,
              position: 'fixed',
              top: 0,
              width: '100%'
            }}
          >
            <Box
              component={NextLink}
              href="/"
              sx={{
                display: 'inline-flex',
                height: 32,
                width: 32
              }}
            >
              <Logo />
            </Box>
          </Box>
          {children}
        </Grid>
        <Grid
          xs={12}
          lg={6}
          sx={{
            alignItems: 'center',
            background: 'radial-gradient(50% 50% at 50% 50%, #122647 0%, #090E23 100%)',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            '& img': {
              maxWidth: '80%'
            },
            backgroundImage: 'url(/assets/01talent.jpeg)',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography
              align="center"
              color="inherit"
              sx={{
                fontSize: '24px',
                lineHeight: '32px',
                mb: 1
              }}
              variant="h1"
            >
              Welcome to{' '}
              <Box
                component="a"
                sx={{ color: '#15B79E' }}
                target="_blank"
              >
                Talent Guider
              </Box>
            </Typography>
            <Typography
              align="center"
              sx={{ mb: 3 }}
              variant="subtitle1"
            >
              Here you can plan your projects and manage your time.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

Layout.prototypes = {
  children: PropTypes.node
};