import {loadDevTools} from './dev-tools/load'
import './bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'
import {App} from './app'
import {AppProviders} from './context'
import {Profiler} from 'components/profiler';

// ignoring update phases for the profiler used at app route
// gives us information on how long application takes to mount at the start
loadDevTools(() => {
  ReactDOM.render(
    <Profiler id="App Root" phases={["mount"]}> 
        <AppProviders>
        <App />
        </AppProviders>
    </Profiler>,
    document.getElementById('root'),
  )
})
