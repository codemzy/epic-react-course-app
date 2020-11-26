import {loadDevTools} from './dev-tools/load'
import './bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'
import {AppProviders} from './context/index'
import {App} from './app'

loadDevTools(() => {
  ReactDOM.render(
      <AppProviders>
        <App />
      </AppProviders>,
    document.getElementById('root'),
  )
})
