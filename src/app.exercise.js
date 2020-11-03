/** @jsx jsx */
import {jsx} from '@emotion/core'

import React from 'react'
import * as auth from 'auth-provider'
import {client} from './utils/api-client'
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'

async function checkUser() {
    const token = await auth.getToken();
    if (token) {
        // we're logged in! Let's go get the user's data:
        return await client('me', {"Authorization": `Bearer ${token}`}).then(data => {
            return data.user;
        });
    }
};

function App() {
  const [user, setUser] = React.useState(null)

  // extra 1 - check if user on page load
  React.useEffect(() => {
    checkUser().then(function(u) {
        setUser(u);
    });
  }, []);

  const login = form => auth.login(form).then(u => setUser(u))
  const register = form => auth.register(form).then(u => setUser(u))
  const logout = () => {
    auth.logout()
    setUser(null)
  }

  return user ? (
    <AuthenticatedApp user={user} logout={logout} />
  ) : (
    <UnauthenticatedApp login={login} register={register} />
  )
}

export {App}
