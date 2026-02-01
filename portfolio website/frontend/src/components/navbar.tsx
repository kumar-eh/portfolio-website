"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Navbar() {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="font-bold text-xl">Portfolio</div>
                <div className="flex gap-6 text-sm font-medium">
                    <button onClick={() => scrollToSection("about")} className="hover:text-primary transition">About</button>
                    <button onClick={() => scrollToSection("skills")} className="hover:text-primary transition">Skills</button>
                    <button onClick={() => scrollToSection("projects")} className="hover:text-primary transition">Projects</button>
                    <button onClick={() => scrollToSection("contact")} className="hover:text-primary transition">Contact</button>
                    <Link href="/admin/login" className="text-muted-foreground hover:text-primary transition">Admin</Link>
                </div>
            </div>
        </nav>
    );
}
