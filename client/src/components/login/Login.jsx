import React, { useEffect, useState } from "react";
import './LoginPage.css';

import { useNavigate, Link } from 'react-router-dom';
import supabase from "../../config/supabaseClient";
import './LoginPage.css'


function LoginPage() {


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    //if the login worked go to the admin page
    if (error) {
      setError(error.message);
    } else {
      navigate('/admin');
    }
  };






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
          <form onSubmit={handleLogin}>
            <h1>Login</h1>
           {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="remember-forgot">
              <label><input type="checkbox" />Remember me</label>
              <a href="#">Forgot password?</a>
            </div>
            
            <button type="submit" className="btn">Login</button>

            <div className="register-link">
              <p>Don't have an account? <Link to="/register">Register</Link></p>
            </div>
          </form>
        </div>
      
    </div>
  );
}

export default LoginPage;