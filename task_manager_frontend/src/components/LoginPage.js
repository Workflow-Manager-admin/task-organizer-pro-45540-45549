import React, { useState } from "react";
import { useAuth } from "./AuthContext";

// PUBLIC_INTERFACE
function LoginPage() {
  const { login, register, error } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setUser((u) => ({ ...u, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (showRegister) {
      await register(user.username, user.password);
    } else {
      await login(user.username, user.password);
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{showRegister ? "Register" : "Login"}</h2>
        <label>
          Username
          <input
            name="username"
            autoFocus
            required
            value={user.username}
            onChange={handleChange}
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            required
            value={user.password}
            onChange={handleChange}
          />
        </label>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : showRegister ? "Register" : "Login"}
        </button>
        <div className="login-toggle">
          {showRegister
            ? (
              <>
                Already have an account?{" "}
                <span onClick={() => setShowRegister(false)}>Login</span>
              </>
            ) : (
              <>
                No account?{" "}
                <span onClick={() => setShowRegister(true)}>Register</span>
              </>
            )
          }
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
