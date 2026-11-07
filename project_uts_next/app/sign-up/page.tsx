"use client";

import React, {SubmitEventHandler, useEffect} from "react";
import Link from "next/link";
import Image from "next/image";
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
            <div className="main-container">
                {/* kotak register */}
                <div className="kotak-register-login">
                    <div className="login-signup-image">
                        <Image className="login-image" src="/aruma.jpg" alt="" width={200} height={200} />
                    </div>
                    <div className="login-signup-box">
                        <Image className="gambar-logo-login" src="/logo.png" alt="" width={200} height={200} />
                        <h2>Sign Up</h2>
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
                        <p className="sign-up">Already have an account? <Link href="/login" className="login-btn">Log In</Link></p>
                    </div>
                </div>
            </div>
        </main>
    )
}