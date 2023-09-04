import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const classes = {
  cookieConsent: {
    backgroundColor: 'black',
    color: '#fff',
    textAlign: 'center',
    padding: '16px', // Adjust spacing as needed
  },
  cookieContent: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    '&:hover': {
      backgroundColor: '#388E3C',
    },
  },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function CookieConsentPopup() {
  
  const [showPopup, setShowPopup] = useState(false);

  // Function to set a cookie with a specified name and value.
  const setCookie = (cookieName, cookieValue, expiryDays) => {
    const d = new Date();
    d.setTime(d.getTime() + (expiryDays * 24 * 60 * 60 * 1000));
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${cookieName}=${cookieValue}; ${expires}; path=/`;
  };

  // Function to check if the user has already accepted cookies.
  const checkCookieConsent = () => {
    if (document.cookie.indexOf("cookieConsent=accepted") === -1) {
      // Cookie consent has not been given; show the popup.
      setShowPopup(true);
    }
  };

  // Function to handle accepting cookies.
  const acceptCookies = () => {
    setCookie("sid", API_URL, 365); // Set the cookie for 1 year.
    setShowPopup(false); // Hide the popup.
  };

  // Check for cookie consent when the component mounts.
  useEffect(() => {
    checkCookieConsent();
  }, []);

  if (!showPopup) {
    return null; // Don't render the popup if it's not shown.
  }

  return (
    <Paper elevation={3} 
    className={classes.cookieContent}>
      <Typography variant="body1">
        We use cookies to improve your experience on our website. By browsing this website, you agree to our use of cookies.
      </Typography>
      <Button
        variant="contained"
        className={classes.acceptButton}
        onClick={acceptCookies}
      >
        Accept Cookies
      </Button>
    </Paper>
  );
}

export default CookieConsentPopup;