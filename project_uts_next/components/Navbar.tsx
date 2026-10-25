import React from "react";
import Image from "next/image";
import Link from "next/link";

export const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-md sticky-top">
            <div className="container-fluid">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav-hamburger" aria-controls="nav-hamburger" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <Link className="navbar-brand" href="index.html">
                    <Image className="nav-logo" src="/logo.png" alt="logo buat nav" width={100} height={100} />
                </Link>
                <div className="navbar-profile dropdown ms-auto order-md-last ms-md-0 d-none" id="profile-out">
                    <Link className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <Image className="profile-picture" src="/profile.png" alt="logo profile" width={100} height={100} />
                        <span className="d-none d-md-inline">Profile</span>
                    </Link>
                    <div className="dropdown-menu dropdown-menu-end">
                        <span className="d-inline d-sm-none username">Profile
                            <hr className="dropdown-hr" />
                        </span>
                        <Link className="dropdown-item" href="login.html">Log In</Link>
                        <Link className="dropdown-item" href="sign-up.html">Sign Up</Link>
                    </div>
                </div>
                <div className="navbar-profile dropdown ms-auto order-md-last ms-md-0 d-none" id="profile-logged">
                    <Link className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <Image className="profile-picture" src="/profile.png" alt="profile-picture-img" width={100} height={100} />
                        <span className="d-none d-md-inline">Profile</span>
                    </Link>
                    <div className="dropdown-menu dropdown-menu-end">
                        <span className="d-inline d-sm-none username">Profile
                            <hr className="dropdown-hr"/>
                        </span>
                        <Link className="dropdown-item" href="profile.html">View Profile</Link>
                        <Link className="dropdown-item" href="/api/logout">Sign Out</Link>
                    </div>
                </div>
                <div className="collapse navbar-collapse justify-content-center" id="nav-hamburger">
                    <div className="navbar-nav">
                        <Link className="nav-link" href="/">Home</Link>
                        <Link className="nav-link" href="/explore">Explore</Link>
                        <Link className="nav-link" href="/admin">Admin</Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}