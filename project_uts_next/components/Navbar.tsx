"use client";

import React, {useEffect, useState} from "react";
import Image from "next/image";
import Link from "next/link";

export const Navbar = () => {
    const [elements, setElements] = useState<string[]>();
    
    useEffect(() => {
        const check: any = async() => {
            const res = await fetch('/api/session');
            const session = await res.json();

            if(session?.role === "admin"){
                setElements(() => ["admin"]);
            }
        };

        check();
    }, []);

    return (
        <nav className="navbar navbar-expand-md sticky-top">
            <div className="container-fluid">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav-hamburger" aria-controls="nav-hamburger" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <Link className="navbar-brand" href="/">
                    <Image className="nav-logo" src="/logo.png" alt="logo buat nav" width={100} height={100} />
                </Link>
                <div className="navbar-profile dropdown ms-auto order-md-last ms-md-0 d-none" id="profile-out">
                    <div className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <Image className="profile-picture" src="/profile.png" alt="logo profile" width={100} height={100} />
                        <span className="d-none d-md-inline">Profile</span>
                    </div>
                    <div className="dropdown-menu dropdown-menu-end">
                        <span className="d-inline d-sm-none username">Profile
                            <hr className="dropdown-hr" />
                        </span>
                        <Link className="dropdown-item" href="/login">Log In</Link>
                        <Link className="dropdown-item" href="/sign-up">Sign Up</Link>
                    </div>
                </div>
                <div className="navbar-profile dropdown ms-auto order-md-last ms-md-0 d-none" id="profile-logged">
                    <div className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <Image className="profile-picture" src="/profile.png" alt="profile-picture-img" width={100} height={100} />
                        <span className="d-none d-md-inline">Profile</span>
                    </div>
                    <div className="dropdown-menu dropdown-menu-end">
                        <span className="d-inline d-sm-none username">Profile
                            <hr className="dropdown-hr"/>
                        </span>
                        <Link className="dropdown-item" href="/profile">View Profile</Link>
                        <Link className="dropdown-item" href="/api/logout" prefetch={false}>Sign Out</Link>
                    </div>
                </div>
                <div className="collapse navbar-collapse justify-content-center" id="nav-hamburger">
                    <div className="navbar-nav">
                        <Link className="nav-link" href="/">Home</Link>
                        <Link className="nav-link" href="/explore">Explore</Link>
                        {elements?.map((item, index) => (
                            <Link className="nav-link" key={index} href={`/${item}`}>Admin</Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    )
}