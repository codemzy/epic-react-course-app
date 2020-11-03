/** @jsx jsx */
import {jsx} from '@emotion/core'

import React from 'react'
import * as auth from 'auth-provider'
import {client} from './utils/api-client'
import {useAsync} from './utils/hooks';
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'
import {FullPageSpinner} from 'components/lib';
import * as colors from 'styles/colors';

async function getUser() {
  const token = await auth.getToken()
  if (token) {
    return await client('me', {token}).then(function(response) {
        return response.user;
    })
  }
}

function App() {
    const {data: user, setData, error, isIdle, isLoading, isSuccess, isError, run} = useAsync();

  React.useEffect(() => {
    run(getUser());
  }, [run])

  const login = form => run(auth.login(form));
  const register = form => run(auth.register(form));
  const logout = () => {
    auth.logout()
    setData(null)
  }

  if (isLoading || isIdle) {
      return <FullPageSpinner />
  } else if (isError) {
    return (
        <div
            css={{
                color: colors.danger,
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <p>Uh oh... There's a problem. Try refreshing the app.</p>
            <pre>{error.message}</pre>
        </div>
    );
  } else if (isSuccess) {
    return user ? (
        <AuthenticatedApp user={user} logout={logout} />
    ) : (
        <UnauthenticatedApp login={login} register={register} />
    )
  }
}

export {App}
