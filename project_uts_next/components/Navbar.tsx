"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export const Navbar = () => {
    const [elements, setElements] = useState<string[]>();

    useEffect(() => {
        const check: any = async() => {
            const res = await fetch('/api/session');
            const session = await res.json();

            console.log(session)

            if(session){
                if(session.role === "admin"){
                    setElements(() => ["admin"]);
                }

                const profileName = document.getElementById("profile-name");
                if(profileName){
                    profileName.textContent = session.username;
                }

                const profileOut = document.getElementById("profile-out");
                if(profileOut){
                    profileOut.hidden = true;
                }

                return;
            }

            const profileIn = document.getElementById("profile-logged");
            if(profileIn){
                profileIn.hidden = true;
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
                    <Image className="nav-logo" src="/images/websiteEssentials/logo.png" alt="logo buat nav" width={100} height={100} />
                    <span className="nav-title d-none d-md-inline">Kuliner Nusantara di Jakarta</span>
                </Link>
                <span className="nav-divider d-none d-md-block"></span>
                <div className="navbar-profile dropdown ms-auto order-md-last ms-md-0 d-none" id="profile-out">
                    <div className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <Image className="profile-picture" src="/images/websiteEssentials/profile.png" alt="logo profile" width={100} height={100} />
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
                        <Image className="profile-picture" src="/images/websiteEssentials/profile.png" alt="profile-picture-img" width={100} height={100} />
                        <span id="profile-name" className="d-none d-md-inline">Profile</span>
                    </div>
                    <div className="dropdown-menu dropdown-menu-end">
                        <span className="d-inline d-sm-none username">Profile
                            <hr className="dropdown-hr"/>
                        </span>
                        <Link className="dropdown-item" href="/profile">View Profile</Link>
                        <Link className="dropdown-item" href="/logout" prefetch={false}>Sign Out</Link>
                    </div>
                </div>
                <div className="collapse navbar-collapse" id="nav-hamburger">
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