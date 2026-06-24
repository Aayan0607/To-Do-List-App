import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleRegister = async () => {
    try {
        const userCredential =
        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        console.log("User created:", userCredential.user);
    } catch (error) {
        console.error(error.message);
    }
    };

  return (
    <>
      <h2>Register</h2>
      <p>Email: {email}</p>
      <p>Password: {password}</p>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <br />

      <button onClick={handleRegister}>Register</button>
    </>
  );
}