// 🐨 you'll need to import React and ReactDOM up here
import React from 'react';
import ReactDOM from 'react-dom';

// 🐨 you'll also need to import the Logo component from './components/logo'
import {Logo} from './components/logo';

// 🐨 create an App component here and render the logo, the title ("Bookshelf"), a login button, and a register button.
// 🐨 for fun, you can add event handlers for both buttons to alert that the button was clicked
function App() {

    function clickLogin(event) {
        alert("The login button was clicked");
    };

    function clickRegister(event) {
        alert("The register button was clicked");
    };

    return (
        <div>
            <Logo width="80" height="80" />
            <h1>Bookshelf</h1>
            <button onClick={clickLogin}>Login</button>
            <button onClick={clickRegister}>Register</button>
        </div>
    );
};

// 🐨 use ReactDOM to render the <App /> to the root element
// 💰 find the root element with: document.getElementById('root')
ReactDOM.render(<App />, document.getElementById('root'));
