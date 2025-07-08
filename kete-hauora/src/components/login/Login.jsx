import React, { useEffect, useState } from "react";
import './LoginPage.css';

import { useNavigate, Link } from 'react-router-dom';
import supabase from "../../config/supabaseClient";
import './LoginPage.css'
import { useAuth } from '../../hooks/useAuth';
import Navbar from "../navbar/navbar";


function LoginPage() {
  const { user, loading } = useAuth();

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
    }else{
      navigate('/');
    }
  };


  return (
    <div className="login">     
        <Navbar />

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