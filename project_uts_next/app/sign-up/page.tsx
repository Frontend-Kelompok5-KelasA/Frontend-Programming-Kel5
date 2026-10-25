"use client";

import React, {SubmitEventHandler, useEffect} from "react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { checkSession } from "@/script/sign-up";
import { loadSession } from "@/script/utils";
import {redirect} from "next/navigation";

export default function SignUp() {
    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>){
        event.preventDefault();

        const data = Object.fromEntries(new FormData(event.currentTarget));

        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if(result.success && result.login)redirect('/');

        if(result.success){
            redirect('/login');
        }
    }

    useEffect(() => {
        checkSession();
        loadSession();
    }, []);

    return (
        <main>
            <Navbar />
                <div className="main-container">
                    {/* kotak register */}
                    <div className="kotak-register-login">
                        <Image className="gambar-logo-login" src="/logo.png" alt="" width={200} height={200} />
                        <h2>Welcome</h2>
                        <p>Sign up to explore the Nusantara</p>

                        <form className="halaman-regist-login" onSubmit={handleSubmit}>
                            <input type="email" name="email" placeholder="Email" required/>
                            <input
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    spellCheck={false}
                                    required
                            />
                            <input type="password" name="password" placeholder="Make a password" minLength={8} required/>
                            <button type="submit" id="submit">Register</button>
                        </form>
                    </div>
                </div>
            <Footer />
        </main>
    )
}