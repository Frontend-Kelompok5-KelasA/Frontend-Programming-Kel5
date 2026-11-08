"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { checkSession } from "@/script/login";
import { loadSession } from "@/script/utils";

export default function Login() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setLoading(true);

        const data = Object.fromEntries(new FormData(event.currentTarget));

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                window.location.href = '/';
                return;
            }

            setError(result.message || "Email atau password salah");
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
                {/* kotak login  */}
                <div className="kotak-register-login">
                    <div className="login-signup-image">
                        <Image className="login-image" src="/images/restaurantImages/aruma.jpg" alt="" width={200} height={200} />
                    </div>
                    <div className="login-signup-box">
                        <Image className="gambar-logo-login" src="/images/websiteEssentials/logo.png" alt="" width={200} height={200}/>
                        <h2>Welcome Back</h2>
                        <p>Login to explore the Nusantara</p>

                        <form className="halaman-regist-login" onSubmit={handleSubmit}>
                            <input type="email" name="email" required placeholder="Email" onChange={() => setError("")}/>
                            <input type="password" name="password" required placeholder="Password" onChange={() => setError("")}/>
                            {error && (<p className="login-error" role="alert">{error}</p>)}
                            <button type="submit" id="submit" disabled={loading}>Login</button>
                        </form>
                        <p className="forgot-password"><Link href="/forgot-password" className="login-btn">I forgot my password</Link></p>
                        <hr/>
                        <p className="sign-up">Don&apos;t have an account? <Link href="/sign-up" className="login-btn">Sign Up</Link></p>
                    </div>
                </div>
            </div>
        </main>
    )
}