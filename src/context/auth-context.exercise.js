import React from 'react'

const AuthContext = React.createContext({});

const useAuth = function() {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error("You need to 'useAuth' inside the AuthContext provider!");
    }
    return context;
};

export {AuthContext, useAuth}
