import '@reach/dialog/styles.css'
import React from 'react'
import ReactDOM from 'react-dom'
import {Dialog} from '@reach/dialog'
import {Logo} from './components/logo'

function LoginForm(props) {
    // state
    const [form, setForm] = React.useState({ username: "", password: "" });

    function handleSubmit(event) {
        event.preventDefault();
        props.onSubmit(form);
    };

    function handleChange(event) {
        setForm({...form, [event.target.name]: event.target.value });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="login-username">Username</label>
                <input id="login-username" type="text" name="username" value={form.username} onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="login-password">Password</label>
                <input id="login-password" type="password" name="password" value={form.password} onChange={handleChange} />
            </div>
            <button>{props.buttonText}</button>
        </form>
    )
};

function App() {
    const [openModal, setOpenModal] = React.useState('none')

    function handleLogin(formData) {
        console.log('login', formData)
    };

    function handleRegister(formData) {
        console.log('register', formData)
    };

  return (
    <div>
      <Logo width="80" height="80" />
      <h1>Bookshelf</h1>
      <div>
        <button onClick={() => setOpenModal('login')}>Login</button>
      </div>
      <div>
        <button onClick={() => setOpenModal('register')}>Register</button>
      </div>
      <Dialog aria-label="Login form" isOpen={openModal === 'login'}>
        <div>
          <button onClick={() => setOpenModal('none')}>Close</button>
        </div>
        <h3>Login</h3>
        <LoginForm onSubmit={handleLogin} buttonText="Login" />
      </Dialog>
      <Dialog aria-label="Registration form" isOpen={openModal === 'register'}>
        <div>
          <button onClick={() => setOpenModal('none')}>Close</button>
        </div>
        <h3>Register</h3>
        <LoginForm onSubmit={handleRegister} buttonText="Register" />
      </Dialog>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
