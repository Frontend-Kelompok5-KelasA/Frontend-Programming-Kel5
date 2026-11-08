"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { checkSession } from "@/script/sign-up";
import { loadSession } from "@/script/utils";

export default function SignUp() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>){
        event.preventDefault();
        setError("");
        setLoading(true);

        const data = Object.fromEntries(new FormData(event.currentTarget));

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                window.location.href = result.login ? '/' : '/login';
                return;
            }

            setError(result.message || "Pendaftaran gagal, silakan coba lagi.");
        } catch {
            setError("Terjadi kesalahan, silakan coba lagi.");
        } finally {
            setLoading(false);
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
                        <Image className="login-image" src="/images/restaurantImages/aruma.jpg" alt="" width={200} height={200} />
                    </div>
                    <div className="login-signup-box">
                        <Image className="gambar-logo-login" src="/images/websiteEssentials/logo.png" alt="" width={200} height={200} />
                        <h2>Sign Up</h2>
                        <p>Sign up to explore the Nusantara</p>

                        <form className="halaman-regist-login" onSubmit={handleSubmit}>
                            <input type="email" name="email" placeholder="Email" required onChange={() => setError("")}/>
                            <input type="text" name="username" placeholder="Username" spellCheck={false} required onChange={() => setError("")}/>
                            <input type="password" name="password" placeholder="Make a password" minLength={8} required onChange={() => setError("")}/>
                            {error && <p className="login-error" role="alert">{error}</p>}
                            <button type="submit" id="submit" disabled={loading}>Register</button>
                        </form>
                        <p className="sign-up">Already have an account? <Link href="/login" className="login-btn">Log In</Link></p>
                    </div>
                </div>
            </div>
        </main>
    )
}