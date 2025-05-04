import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AdminDashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) setAuthorized(true);
    else alert("Unauthorized");
  };

  if (!authorized)
    return (
      <div style={{ padding: 20 }}>
        <h1>Admin Login</h1>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={login}>Login</button>
      </div>
    );

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>
      <p>Only you can view this page. Add user, manage data, and monitor generation.</p>
      {/* Add future controls here */}
    </div>
  );
}
