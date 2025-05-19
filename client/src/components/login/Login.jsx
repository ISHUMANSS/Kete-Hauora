import React from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  return (
    <div className="login">
     
        <nav className="navbar">
          <Link to="/">LOGO</Link>
          <ul className="nav-links">
            <li><Link to="/about">About</Link></li>
            <li>
              <span className="login-icon material-symbols-outlined">person</span>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>

        <div className="wrapper">
          <form action="">
            <h1>Login</h1>
            <div className="input-box">
              <input type="text" placeholder="Username" required />
              <i className='bxr bx-user'></i>
            </div>
            
            <div className="input-box">
              <input type="password" placeholder="Password" required />
              <i className='bxr bx-lock'></i>
            </div>

            <div className="remember-forgot">
              <label><input type="checkbox" />Remember me</label>
              <a href="#">Forgot password?</a>
            </div>
            
            <button type="submit" className="btn">Login</button>

            <div className="register-link">
              <p>Don't have an account? <a href="#">Register</a></p>
            </div>
          </form>
        </div>
      
    </div>
  );
}

export default LoginPage;