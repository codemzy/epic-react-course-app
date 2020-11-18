import {loadDevTools} from './dev-tools/load'
import './bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'
import {App} from './app'
import {ReactQueryConfigProvider} from 'react-query';

const queryConfig = {
    queries: {
        refetchOnWindowFocus: false,
        useErrorBoundary: true,
        retry: function(failureCount, error) {
            if (error.status === 404) {
                return false; // don't retry
            }
            return failureCount < 2 ? true : false;
        }
    },
};

loadDevTools(() => {
    ReactDOM.render(
        <ReactQueryConfigProvider config={queryConfig}>
            <App />
        </ReactQueryConfigProvider>,
        document.getElementById('root'),
    );
});
