"use client";

import Image from "next/image";
import Link from "next/link";

interface LoginFirstProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginFirst({ isOpen, onClose }: LoginFirstProps) {
    return (
        <main>
            <div id="modal-login-dulu"
            // kalau isOpen true, modal muncul jadi flex, kalau ketutup display none
            style={{ display: isOpen ? "flex" : "none" }}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}>
                <div className="modal-login-content">
                    <Image className="gambar-logo-login" src="/images/websiteEssentials/logo.png" alt="" width={200} height={200}/>
                    <h3>Harap Login/Register Terlebih Dahulu</h3>
                    <p>Buat akun untuk dapat akses keseluruhan fitur dari website kami.</p>

                    <div className="login-actions">
                        <Link href="/login" onClick={onClose}>
                            <button id="login-button">Login</button>
                        </Link>
                        <Link href="/sign-up" onClick={onClose}>
                            <button id="register-button">Register</button>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}