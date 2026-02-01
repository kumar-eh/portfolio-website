"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProjectDetail() {
    const { id } = useParams();
    const [project, setProject] = useState<any>(null);

    useEffect(() => {
        // In a real app, fetch individual project. For now we assume the list endpoint returns basic data
        // Ideally we'd have /api/projects/:id
        // TODO: Implement GET /api/projects/:id in backend
        if (id) {
            // Mock for now or implement backend endpoint
            console.log("Fetching project", id);
        }
    }, [id]);

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="container mx-auto px-4 pt-24">
                <Link href="/#projects" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
                </Link>

                {project ? (
                    <div>
                        <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
                        <p>{project.description}</p>
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <h1 className="text-2xl font-bold">Project Detail Placeholder</h1>
                        <p className="text-muted-foreground">Backend endpoint for single project fetch to be implemented.</p>
                        <p className="mt-4">ID: {id}</p>
                    </div>
                )}
            </div>
        </main>
    );
}
