import "./LoginPage.css";

import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";
import supabase from "../../config/supabaseClient";
import "./LoginPage.css";

import { useTranslation } from "react-i18next";

function LoginPage() {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else if (data?.user) {
      const userId = data.user.id;

      // fetch role from profiles
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role_id")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("Error fetching role:", profileError.message);
        navigate("/");
      } else {
        if (profile.role_id === 1) {
          navigate("/super-admin-dashboard");
        } else if (profile.role_id === 2) {
          navigate("/provider-dashboard");
        } else {
          navigate("/");
        }
      }
    }
  };

  return (
    <div className="login">
      <div className="wrapper">
        <form onSubmit={handleLogin}>
          <h1>{t("Login")}</h1>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="input-box">
            <input
              type="email"
              placeholder={t("Email")}
              value={email}
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

          <div className="remember-forgot">
            {/*does not exist idk they just didn't make it
            <label>
              <input type="checkbox" />
              {t("Remember me")}
            </label>
            */}
            
            {/*Our forgot password like doesn't work casue supabase so like just don't forget the password
              <button
              type="button"
              className="forgot-password-link"
              onClick={() => alert("Forgot password clicked!")}
            >
              {t("Forgot password")}?
            </button>
            */}
          </div>

          <button type="submit" className="btn">
            {t("Login")}
          </button>

          <div className="register-link">
            <p>
              {t("Don't have an account?")}{" "}
              <Link to="/register">{t("Register")}</Link>
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

export default LoginPage;
