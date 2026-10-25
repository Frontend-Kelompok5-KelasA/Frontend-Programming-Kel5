"use client";
import { useEffect } from "react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { checkSession } from "@/script/sign-up";

export default function SignUp() {
    useEffect(() => {
        checkSession();
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

                        <form className="halaman-regist-login" action="http://localhost:8080/api/register" method="post">
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