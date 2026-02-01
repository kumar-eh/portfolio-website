"use client";
import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Github, Linkedin, FileText, Code, Mail } from "lucide-react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/config";

interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/projects`)
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Failed to fetch projects:", err));
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* About Section */}
      <section id="about" className="h-[80vh] flex flex-col justify-center items-center text-center px-4 pt-16">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-2">
          Hello, I'm Nandha
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-8">
          A passionate Full Stack Developer specializing in Rust & Modern Web Technologies.
        </p>
        <div className="flex gap-4">
          <Link href="https://github.com" target="_blank" className="p-2 border rounded-full hover:bg-secondary transition">
            <Github className="w-6 h-6" />
          </Link>
          <Link href="https://linkedin.com" target="_blank" className="p-2 border rounded-full hover:bg-secondary transition">
            <Linkedin className="w-6 h-6" />
          </Link>
          <Link href="/resume" target="_blank" className="p-2 border rounded-full hover:bg-secondary transition">
            <FileText className="w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Technical Skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {["Rust", "Next.js", "PostgreSQL", "TypeScript", "Docker", "AWS", "Git", "System Design"].map((skill) => (
              <div key={skill} className="p-4 border rounded-xl bg-card hover:shadow-lg transition text-center font-medium flex items-center justify-center gap-2">
                <Code className="w-4 h-4 text-blue-500" /> {skill}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.length === 0 ? (
              <p className="text-center col-span-full text-muted-foreground">Loading projects or no projects found...</p>
            ) : (
              projects.map((project) => (
                <Link href={`/projects/${project.id}`} key={project.id} className="group">
                  <div className="border rounded-xl p-6 h-full hover:shadow-xl transition bg-card flex flex-col">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition">{project.title}</h3>
                    <p className="text-muted-foreground mb-4 flex-grow line-clamp-3">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {/* Tech stack rendering handling various formats */}
                      {Array.isArray(project.tech_stack) ? project.tech_stack.map((t: string) => (
                        <span key={t} className="text-xs bg-secondary px-2 py-1 rounded-md">{t}</span>
                      )) : JSON.stringify(project.tech_stack)}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-xl">
          <h2 className="text-3xl font-bold mb-12 text-center">Get In Touch</h2>
          <form className="space-y-6 bg-card p-8 rounded-xl border shadow-sm">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input type="text" className="w-full p-2 rounded-md border bg-background" placeholder="Your Name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" className="w-full p-2 rounded-md border bg-background" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea className="w-full p-2 rounded-md border bg-background h-32" placeholder="How can I help you?"></textarea>
            </div>
            <button className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:opacity-90 transition font-medium">Send Message</button>
          </form>
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t">
        <p>&copy; {new Date().getFullYear()} Nandha Kumar. Built with Rust & Next.js.</p>
      </footer>
    </main>
  );
}
