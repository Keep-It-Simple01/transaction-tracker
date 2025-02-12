import React, { createContext, useReducer } from 'react';

export const AuthContext = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, user: action.payload, isAuthenticated: true };
        case 'LOGOUT':
            return { ...state, user: null, isAuthenticated: false };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, { user: null, isAuthenticated: false });

    const signIn = (user) => {
        dispatch({ type: 'LOGIN', payload: user });
    };

    const signOut = () => {
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <AuthContext.Provider value={{ signIn, signOut, user: state.user, isAuthenticated: state.isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};
