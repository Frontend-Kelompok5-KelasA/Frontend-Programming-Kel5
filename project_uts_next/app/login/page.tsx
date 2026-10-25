"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { checkSession } from "@/script/login";
import {redirect} from "next/navigation";

export default function Login() {
    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>){
        event.preventDefault();

        const data = Object.fromEntries(new FormData(event.currentTarget));

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if(result.success)redirect('/');

        redirect('/login');
    }

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

                    <form className="halaman-regist-login" onSubmit={handleSubmit}>
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