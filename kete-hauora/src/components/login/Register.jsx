import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../config/supabaseClient';
import './LoginPage.css';


//just combineing register and login togther for simplicity for now
//prob can rename/make the folder auth or somthing because they are working togther to create and login for a user
//also cause I wanted to use the same css

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    //register the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    //check it worked
    if (signUpError) {
      setError(signUpError.message);
      return;
    }


    const userId = signUpData.user.id;

    // Assign default role "company" (or let user select role via dropdown)
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ id: userId, role: 'company' }]);

    if (profileError) {
      setError(profileError.message);
      return;
    }


    //log in the newly created user
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
    } else {
      navigate('/');
    }
  };


  //ADD A BETTER PASSWORD CHECKING FUNCTION IN JS AND THEN ALSO UPDATE THE SUPABASE REQUIRMENTS FOR A PASSWORD
  /*
  function checkPassword() {
    //add like patterns and such
  }
  */


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
        <form onSubmit={handleRegister}>
          <h1>Register</h1>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn">Register</button>

          <div className="register-link">
            <p>Already have an account? <Link to="/login">Login</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
