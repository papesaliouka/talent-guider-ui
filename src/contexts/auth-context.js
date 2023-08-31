import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT'
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...(
        // if payload (user) is provided, then is authenticated
        user
          ? ({
            isAuthenticated: true,
            isLoading: false,
            user
          })
          : ({
            isLoading: false
          })
      )
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null
    };
  }
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;
    
    let isAuthenticated = state.isAuthenticated;

    try {
      const response = await fetch(`${API_URL}/api/auth/check-session`, {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok){
        isAuthenticated = true;
      }else{
        throw new Error("Not authenticated")
      }

    } catch (err) {
      console.error(err);
    }

    if (isAuthenticated) {

      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: state.user
      });
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE
      });
    }
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );


  const signIn = async (email, password) => {

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password
        })
      });

      if (response.ok) {
        const data = await response.json();
        dispatch({
          type: HANDLERS.SIGN_IN,
          payload: data.user
        });
      } else {
        throw new Error('Please check your email and password');
        
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
        console.log(data);
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
          type: HANDLERS.SIGN_OUT
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