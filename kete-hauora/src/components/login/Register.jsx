import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";
import "./LoginPage.css";

import { useTranslation } from "react-i18next";

//just combineing register and login togther for simplicity for now
//prob can rename/make the folder auth or somthing because they are working togther to create and login for a user
//also cause I wanted to use the same css

function RegisterPage() {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    //tests the password against the regex
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters long and contain at least one special character.");
      return;
    }

    //register the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
      }
    );

    //check it worked
    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    const userId = signUpData.user.id;

    // Assign default role "company"
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([{ id: userId, email: email, role_id: "2" }]);

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
      navigate("/");
    }
  };


  return (
    <div className="login">
      <div className="wrapper">
        <form onSubmit={handleRegister}>
          <h1>{t("Register")}</h1>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="input-box">
            <input
              type="email"
              placeholder={t("Email")}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t("Password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="show-password-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? t("Hide") : t("Show")}
            </button>
          </div>

          <button type="submit" className="btn">
            {t("Register")}
          </button>

          <div className="register-link">
            <p>
              {t("Already have an account?")} <Link to="/login">Login</Link>
            </p>
          </div>
          <div className="back-link">
            <Link to="/">← {t("Back to Home")}</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
