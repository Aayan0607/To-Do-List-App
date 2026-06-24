import { Link } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";

export default function Login() {
  return (
    <>
      <h2>Login Page</h2>
      <Link to="/register">
        <button>Register</button>
      </Link>

      <Link to="/dashboard">
        <button>Go To Dashboard</button>
      </Link>
    </>
  );
}