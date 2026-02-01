"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem("token", data.token);
                router.push("/admin/dashboard");
            } else {
                setError("Invalid credentials");
            }
        } catch (err) {
            setError("Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20">
            <div className="w-full max-w-md p-8 bg-card rounded-xl border shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
                {error && <div className="p-3 mb-4 bg-red-500/10 text-red-500 rounded-md text-sm">{error}</div>}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 rounded-md border bg-background"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 rounded-md border bg-background"
                        />
                    </div>
                    <button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium hover:opacity-90">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
