"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { onLoad } from "@/script/navbar";

export const Navbar = () => {
  const [elements, setElements] = useState<string[]>();
  const [role, setRole] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const refs = useRef<any>({
    desc: {
      title: null,
    },
    tabs: {
      home: null,
      explore: null,
      favorite: null,
      "about-us": null,
      contact: null,
    },
  });

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const nav = navRef.current;
      if (!nav) return;

      const menu = nav.querySelector<HTMLElement>("#nav-hamburger");
      const toggler = nav.querySelector<HTMLButtonElement>(".navbar-toggler");
      if (!menu || !toggler) return;

      const isOpen = menu.classList.contains("show");
      const isMobileLayout = getComputedStyle(toggler).display !== "none";
      if (!isOpen || !isMobileLayout) return;

      if (nav.contains(event.target as Node)) return;

      toggler.click();
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  useEffect(() => {
    const check: any = async () => {
      const res = await fetch("/api/session");
      const session = await res.json();

      console.log(session);

      if (session) {
        if (session.role === "admin") {
          setElements(() => ["admin"]);
        }

        const profileName = document.getElementById("profile-name");
        if (profileName) {
          profileName.textContent = session.username;
        }

        const profileOut = document.getElementById("profile-out");
        if (profileOut) {
          profileOut.hidden = true;
        }

        return;
      }

      const profileIn = document.getElementById("profile-logged");
      if (profileIn) {
        profileIn.hidden = true;
      }
    };

    check();
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/session", {
          cache: "no-store",
        });

        const session = await response.json();

        if (session) {
          setRole(session.role);
        }
      } catch (error) {
        console.error("Gagal memeriksa session:", error);
      }
    };

    checkSession();

    const load = async () => {
      await onLoad(refs.current);

      setLoaded(true);
    };

    load();
  }, []);

  return (
    <nav ref={navRef} className="navbar navbar-expand-md sticky-top">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav-hamburger"
          aria-controls="nav-hamburger"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <Link className="navbar-brand" href="/">
          <Image
            className="nav-logo"
            src="/images/websiteEssentials/logo.png"
            alt="logo buat nav"
            width={100}
            height={100}
          />
          <span
            className="nav-title d-none d-md-inline"
            ref={(e: any) => (refs.current.desc.title = e)}
          />
        </Link>
        <span className="nav-divider d-none d-md-block"></span>
        <div
          className="navbar-profile dropdown ms-auto order-md-last ms-md-0 d-none"
          id="profile-out"
        >
          <div
            className="nav-link dropdown-toggle"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <Image
              className="profile-picture"
              src="/images/websiteEssentials/profile.png"
              alt="logo profile"
              width={100}
              height={100}
            />
            <span className="d-none d-md-inline">Account</span>
          </div>
          <div className="dropdown-menu dropdown-menu-end">
            <span className="d-inline d-sm-none username">
              Account
              <hr className="dropdown-hr" />
            </span>
            {role !== "admin" && (
              <>
                <Link className="dropdown-item" href="/auth/login">
                  Log In
                </Link>
                <Link className="dropdown-item" href="/auth/sign-up">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
        <div
          className="navbar-profile dropdown ms-auto order-md-last ms-md-0 d-none"
          id="profile-logged"
        >
          <div
            className="nav-link dropdown-toggle"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <Image
              className="profile-picture"
              src="/images/websiteEssentials/profile.png"
              alt="profile-picture-img"
              width={100}
              height={100}
            />
            <span id="profile-name" className="d-none d-md-inline">
              Account
            </span>
          </div>
          <div className="dropdown-menu dropdown-menu-end">
            <span className="d-inline d-sm-none username">
              Account
              <hr className="dropdown-hr" />
            </span>
            {role === "user" ? (
              <>
                <Link className="dropdown-item" href="/users/profile">
                  View Profile
                </Link>
              </>
            ) : null}
            {role === "restaurant" ? (
              <Link className="dropdown-item" href="/restaurant">
                Dashboard Toko
              </Link>
            ) : null}
            <Link className="dropdown-item" href="/users/settings">
              Settings
            </Link>
            {role === "admin" ? (
              <Link className="dropdown-item" href="/admin">
                Admin
              </Link>
            ) : null}
            <Link
              className="dropdown-item"
              href="/auth/logout"
              prefetch={false}
            >
              Sign Out
            </Link>
          </div>
        </div>
        <div className="collapse navbar-collapse" id="nav-hamburger">
          <div className="navbar-nav">
            {!loaded ? <span className="text-white"> Memuat... </span> : null}
            <Link
              className="nav-link"
              href="/"
              ref={(e: any) => (refs.current.tabs.home = e)}
            />
            <Link
              className="nav-link"
              href="/explore"
              ref={(e: any) => (refs.current.tabs.explore = e)}
            />
            {role === "user" ? (
              <Link
                href="/favorites"
                className="nav-link"
                ref={(e: any) => (refs.current.tabs.favorite = e)}
              />
            ) : null}
            <Link
              className="nav-link"
              href="/about-us"
              ref={(e: any) => (refs.current.tabs["about-us"] = e)}
            />
            <Link
              className="nav-link"
              href="/customer-service"
              ref={(e: any) => (refs.current.tabs.contact = e)}
            />
            {role === "admin" ? (
              <Link className="nav-link" href="/admin">
                Admin
              </Link>
            ) : null}

            {role === "restaurant" ? (
              <Link className="nav-link" href="/restaurant">
                Kelola Toko
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
};
