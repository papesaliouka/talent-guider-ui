import React, { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';

const API_URL = process.env.NEXT_PUBLIC_API_URL 
const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT'
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => ({
    ...state,
    isAuthenticated: !!action.payload,
    isLoading: false,
    user: action.payload,
  }),
  [HANDLERS.SIGN_IN]: (state, action) => ({
    ...state,
    isAuthenticated: true,
    user: action.payload,
    isLoading: false,
  }),
  [HANDLERS.SIGN_OUT]: (state,action) =>({
    ...state,
    isAuthenticated:false,
    user:action.payload,
    isLoading:false
  }),
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthContext = createContext(initialState);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  let initialRender = useRef(false);

  const initialize = async () => {
  
    if (initialRender.current) {
      return;
    }

    if (state.isAuthenticated) {
      return;
    }


    initialRender.current = true;

    try {
      const response = await fetch(`${API_URL}/api/auth/check-session`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const {user} = await response.json();
        dispatch({
          type: HANDLERS.INITIALIZE,
          payload: user,
        });
      } else {
        dispatch({
          type: HANDLERS.INITIALIZE,
          payload: null,
        });
        console.log('Not authenticated');
      }
    } catch (err) {
      console.error(err);
      dispatch({
        type: HANDLERS.SIGN_OUT,
        payload: null,
      });
    }
  };

  useEffect(() => {
    initialize();
    return () => {
      // Cleanup function to cancel ongoing tasks if component unmounts
      // For example, you might cancel ongoing fetch requests here
    };
  }, []);

  const signIn = async (email, password) => {

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          identifier: email,
          password
        })
      });

      if (response.ok) {
        const data = await response.json();
        const cookieHeader = response.headers.get('set-cookie');
        document.cookie = `sid=${cookieHeader}`;


        dispatch({
          type: HANDLERS.SIGN_IN,
          payload: data.user
        });
      } else {
        throw new Error('Please check your email/username and password');
        
      }
    } catch (err) {
      console.error(err);
    }
  };

  const signUp = async (email, username, password) => {
    try{
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          username,
          password
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert("User created successfully");
      } else {
        throw new Error('Please check your email and password');
      }
    } catch (err) {
      console.error(err);
      alert("Error creating user");
    }
  };

  const signOut =async () => {

    try{
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok){
        dispatch({
          type: HANDLERS.SIGN_OUT,
          payload: null

        });
      }else{
        throw new Error("Unable to logout");
      }


    }catch(err){
      console.log(err);
      alert('something went wrong')
    }

  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);