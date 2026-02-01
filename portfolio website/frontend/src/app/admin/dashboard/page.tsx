"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/config";

export default function AdminDashboard() {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newProject, setNewProject] = useState({ title: "", description: "", content: "", tech_stack: "" });
    const [msg, setMsg] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/admin/login");
        } else {
            setAuthorized(true);
        }
    }, [router]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const techStackArray = newProject.tech_stack.split(",").map(s => s.trim());
            const res = await fetch(`${API_BASE_URL}/api/admin/projects`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...newProject, tech_stack: techStackArray }),
            });
            if (res.ok) {
                setMsg("Project created successfully!");
                setNewProject({ title: "", description: "", content: "", tech_stack: "" });
                setIsCreating(false);
            } else {
                setMsg("Failed to create project.");
            }
        } catch (err) {
            setMsg("Error creating project.");
        }
    };

    if (!authorized) return null;

    return (
        <div className="min-h-screen bg-background">
            <nav className="border-b p-4 flex justify-between items-center bg-muted/20">
                <h1 className="font-bold text-xl">Admin Dashboard</h1>
                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        router.push("/");
                    }}
                    className="text-sm text-red-500 hover:text-red-600"
                >
                    Logout
                </button>
            </nav>
            <div className="container mx-auto p-8">
                {msg && <div className="p-4 mb-4 bg-blue-500/10 text-blue-600 rounded-md">{msg}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-6 border rounded-xl bg-card">
                        <h2 className="text-2xl font-bold mb-4">Add New Project</h2>
                        <p className="text-muted-foreground mb-4">Create a new project entry for your portfolio.</p>

                        {!isCreating ? (
                            <button onClick={() => setIsCreating(true)} className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90">Create Project</button>
                        ) : (
                            <form onSubmit={handleCreate} className="space-y-4">
                                <input
                                    placeholder="Title"
                                    className="w-full p-2 border rounded bg-background"
                                    value={newProject.title}
                                    onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                                    required
                                />
                                <textarea
                                    placeholder="Description"
                                    className="w-full p-2 border rounded bg-background"
                                    value={newProject.description}
                                    onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                                    required
                                />
                                <textarea
                                    placeholder="Content (Markdown/HTML)"
                                    className="w-full p-2 border rounded bg-background h-32"
                                    value={newProject.content}
                                    onChange={e => setNewProject({ ...newProject, content: e.target.value })}
                                    required
                                />
                                <input
                                    placeholder="Tech Stack (comma separated)"
                                    className="w-full p-2 border rounded bg-background"
                                    value={newProject.tech_stack}
                                    onChange={e => setNewProject({ ...newProject, tech_stack: e.target.value })}
                                    required
                                />
                                <div className="flex gap-2">
                                    <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded-md">Save</button>
                                    <button type="button" onClick={() => setIsCreating(false)} className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md">Cancel</button>
                                </div>
                            </form>
                        )}
                    </div>
                    <div className="p-6 border rounded-xl bg-card">
                        <h2 className="text-2xl font-bold mb-4">Analytics</h2>
                        <p className="text-muted-foreground">View basic page view stats.</p>
                        <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
                            <p className="font-mono text-sm">Analytics feature coming soon.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
