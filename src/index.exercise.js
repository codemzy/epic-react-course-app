import React from 'react'
import ReactDOM from 'react-dom'
// reach dialog
import {Dialog} from "@reach/dialog";
import '@reach/dialog/styles.css'
// components
import {Logo} from './components/logo'

function App() {
    // state
    const [openModal, setOpenModal] = React.useState("none");

    // modal controls
    const open = (type) => setOpenModal(type);
    const close = () => setOpenModal("none");

    return (
        <div>
            <Logo width="80" height="80" />
            <h1>Bookshelf</h1>
            <div>
                <button onClick={() => open('login')}>Login</button>
            </div>
            <div>
                <button onClick={() => open('register')}>Register</button>
            </div>
            <Dialog aria-label="Login form" isOpen={openModal === "login"} onDismiss={close}>
                <p>This is the log in modal</p>
                <button onClick={close}>Okay</button>
            </Dialog>
            <Dialog aria-label="Registration form" isOpen={openModal === "register"} onDismiss={close}>
                <p>This is the register modal</p>
                <button onClick={close}>Okay</button>
            </Dialog>
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))
