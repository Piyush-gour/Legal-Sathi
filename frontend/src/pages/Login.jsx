import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { assets } from '../assets/assets'

const Login = () => {
  const { backendUrl, userLogin } = useAuth();
  const { refreshToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [state, setState] = useState("Sign Up");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });
        if (data.success) {
          userLogin(data.token, data.user);
          refreshToken(); // Update AppContext with new token
          // Dispatch custom event to notify all components
          window.dispatchEvent(new Event('userLoggedIn'));
          toast.success("Account created successfully!");
          navigate('/user-dashboard');
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (data.success) {
          userLogin(data.token, data.user);
          refreshToken(); // Update AppContext with new token
          // Dispatch custom event to notify all components
          window.dispatchEvent(new Event('userLoggedIn'));
          toast.success("Login successful!");
          navigate('/user-dashboard');
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Remove useEffect since we handle navigation in onSubmitHandler

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center px-4">
      <div className="flex flex-col gap-3 m-auto items-start p-6 sm:p-8 w-full max-w-[400px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>
        <p>
          Please {state === "Sign Up" ? "sign up" : "log in"} to book
          consultation
        </p>
        {state === "Sign Up" && (
          <div className="w-full">
            <p>Full Name</p>
            <input
              className="border border-zinc-300 rounded w-full p-3 mt-1 text-base focus:border-[#5F6FFF] focus:outline-none"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-zinc-300 rounded w-full p-3 mt-1 text-base focus:border-[#5F6FFF] focus:outline-none"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            className="border border-zinc-300 rounded w-full p-3 mt-1 text-base focus:border-[#5F6FFF] focus:outline-none"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-[#5F6FFF] text-white w-full py-3 rounded-md text-base font-medium hover:bg-[#4F5FEF] transition-colors"
        >
          {state === "Sign Up" ? "Create Account" : "Login"}
        </button>
        {state === "Sign Up" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-[#5F6FFF]  underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-[#5F6FFF]  underline cursor-pointer"
            >
              click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;