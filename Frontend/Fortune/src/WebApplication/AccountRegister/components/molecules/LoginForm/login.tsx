import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../../../../src/config/axios";
import '../../authGeneral.scss';
import './login.scss';
import { useUser } from '../../../../../WebApplication/Data/UserContext';
import Alert from 'react-bootstrap/Alert';
import "bootstrap/dist/css/bootstrap.min.css"
const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useUser();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const message = params.get('successMessage');
    if (message) {
      setSuccessMessage(message);
      // Clear the message after 5 seconds
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location.search]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Vui lòng nhập địa chỉ email và mật khẩu.");
      return;
    }

    try {
      const response = await api.post("api/Login/login", {
        accountEmail: email,
        accountPassword: password
      });
      const data = response.data;
      setUser(data);  // Update user context
      sessionStorage.setItem("loginedUser", JSON.stringify(data));
      navigate('/user');
    } catch (error) {
      console.log(error);
      toast.error("Login failed. Try again!");
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  useEffect(() => {
    const userString = sessionStorage.getItem("loginedUser");
    const user = userString ? JSON.parse(userString) : null;
    if (user) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="login-form">
      <div className="LoadedMessage">
        {successMessage && (
          <Alert key={'success'} variant={'success'}>
            {successMessage}
          </Alert>
        )}</div>
      <form onSubmit={handleLogin}>
        <div className="rectangle-border">
          <div className="inputField">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="on"
            />
          </div>
          <div className="inputField">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="login-buttons">
          <button type="submit">Sign in</button>
          <button type="button" onClick={handleRegister}>
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
