import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const disallowedNames = ["aaa", "bbb", "abc", "asdf", "qwerty"];
const disallowedEmails = ["abc@gmail.com", "aaa@gmail.com", "test@gmail.com"];

const isCommonGarbageName = (name) => {
  return disallowedNames.includes(name.toLowerCase());
};

const isCommonGarbageEmail = (email) => {
  const lowerEmail = email.toLowerCase();
  const [prefix] = lowerEmail.split("@");
  return (
    disallowedEmails.includes(lowerEmail) ||
    disallowedNames.includes(prefix) ||
    /^[a-z]{2,3}$/.test(prefix)
  );
};

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [state, setState] = useState("Sign Up");
  const [full_name, setName] = useState("");
  const [user_email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Validation state
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    const nameRegex = /^[A-Za-z\s]+$/;

    if (!nameRegex.test(value)) {
      setNameError("Name can only contain letters and spaces.");
    } else if (isCommonGarbageName(value.trim())) {
      setNameError("Please enter a valid name.");
    } else {
      setNameError("");
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
  
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
    if (value.includes(".")) {
      if (!emailRegex.test(value)) {
        setEmailError("Please enter a valid email address.");
      } else if (isCommonGarbageEmail(value.trim())) {
        setEmailError("Please use a valid email, not a generic one.");
      } else {
        setEmailError("");
      }
    } else {
      setEmailError("");
    }
  };
  

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === "Sign Up") {
        if (nameError) return toast.error(nameError);
        if (emailError) return toast.error(emailError);
        if (password.length < 8) {
          return toast.error("Password must be at least 8 characters long.");
        }

        const { data } = await axios.post(backendUrl + "/api/user/register", {
          full_name,
          user_email,
          password,
        });

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          user_email,
          password,
        });

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>
        <p>
          Please {state === "Sign Up" ? "sign up" : "log in"} to book your
          desired services.
        </p>

        {state === "Sign Up" && (
          <div className="w-full">
            <p>Full Name</p>
            <input
              onChange={handleNameChange}
              value={full_name}
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="text"
              required
            />
            {nameError && <p className="text-red-500 text-xs">{nameError}</p>}
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            onChange={handleEmailChange}
            value={user_email}
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            required
          />
          {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
        </div>

        <div className="w-full relative">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-zinc-300 rounded w-full p-2 mt-1 pr-10"
            type={showPassword ? "text" : "password"}
            required
          />
          <span
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-9 cursor-pointer"
          >
            {showPassword ? "👁️‍🗨️" : "👁️"}
          </span>
        </div>

        <button
          type="submit"
          className="bg-primary text-white w-full py-2 rounded-md text-base"
        >
          {state === "Sign Up" ? "Create account" : "Login"}
        </button>

        {state === "Sign Up" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-primary underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-primary underline cursor-pointer"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
