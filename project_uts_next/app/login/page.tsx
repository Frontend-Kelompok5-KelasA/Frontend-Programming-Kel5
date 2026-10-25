"use client";
import { useEffect } from "react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { checkSession } from "@/script/login";

export default function Login() {
    useEffect(() => {
        checkSession();
    }, []);

    return (
        <main>
            <Navbar />

            <div className="main-container">
                {/* kotak login  */}
                <div className="kotak-register-login">
                    <Image className="gambar-logo-login" src="/logo.png" alt="" width={200} height={200}/>
                    <h2>Welcome Back</h2>
                    <p>Login to explore the Nusantara</p>

                    <form className="halaman-regist-login" action="http://localhost:8080/api/login" method="post">
                        <input type="email" name="email" required placeholder="Email"/>
                        <input type="password" name="password" required placeholder="Password"/>
                        <button type="submit" id="submit">Login</button>
                    </form>
                    <hr/>
                    <p className="sign-up">Don't have an account? <a href="/sign-up" id="register">Sign Up</a></p>
                </div>
            </div>

            <Footer />
        </main>
    )
}