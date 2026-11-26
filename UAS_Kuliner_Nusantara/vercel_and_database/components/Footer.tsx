"use client";
import React, {useEffect, useRef, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {onLoad} from "@/script/footer";

export const Footer = () => {
  const [role, setRole] = useState<string | null>(null);

  const refs = useRef<any>({
    desc: {
      title: null,
      subtitle: null
    },
    tabs: {
      home: null,
      explore: null,
      favorite: null,
      "about-us": null
    },
    socials: {
      email: null,
      whatsapp: null,
      instagram: null
    },
    copyright: null
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/session", {
          cache: "no-store"
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

    onLoad(refs.current);
  }, []);

  return (
    <footer>
      <div className="container-fluid footer-fill">
        <div className="row">
          <div className="col-12 col-md-12 col-lg-5 order-3 order-md-3 order-lg-1 about">
            <div id="footer-title">
              <Image id="footer-logo" src="/images/websiteEssentials/logo.png" alt="logo footer" width={100} height={100} />
              <h3 ref={(e: any) => {refs.current.desc.title = e}}>Memuat data...</h3>
              <p ref={(e: any) => {refs.current.desc.subtitle = e}}>Memuat data...</p>
            </div>
            <br />
            <div id="footer-team">
              <h4>Kelompok 5</h4>
              <ul id="team">
                <li className="member">Gabriella Geraldine / 535250023</li>
                <li className="member">Reyhan Janstephen / 535250034</li>
                <li className="member">Monica Irene / 535250041</li>
                <li className="member">Natanael Gunawan / 535250046</li>
                <li className="member">Moses Marvian Arsata / 535250050</li>
              </ul>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3 order-1 order-md-1 order-lg-2 links">
            <h3>Explore</h3>
            <br />
            <div className="footer-links">
              <Link href="/"
                    className="footer-a"
                    ref={(e: any) => {refs.current.tabs.home = e}}
              > Memuat... </Link>
              <Link href="/explore"
                    className="footer-a"
                    ref={(e: any) => {refs.current.tabs.explore = e}}
              > Memuat... </Link>
              {/* pengecekan, kalau role nya user, tampilkan Favorite di footer  */}
              {role === "user" && (
                <Link href="/favorites"
                      className="footer-a"
                      ref={(e: any) => {refs.current.tabs.favorite = e}}
                > Memuat... </Link>
              )}
              <Link href="/about_us"
                    className="footer-a"
                    ref={(e: any) => {refs.current.tabs["about-us"] = e}}
              > Memuat... </Link>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4 order-2 order-md-2 order-lg-3 contacts">
            <h3>Contact</h3>
            <br />
            <p><i className="bi bi-geo-alt-fill"></i>Jakarta, Indonesia</p>
            <br />
            <div className="footer-socials">
              <Link href="#"
                    className="footer-a"
                    ref={(e: any) => {refs.current.socials.email = e}}
                    target="_blank"
              ><i className="bi bi-envelope-fill"></i>Email</Link>
              <Link href="#"
                    className="footer-a"
                    ref={(e: any) => {refs.current.socials.instagram = e}}
                    target="_blank"
              ><i className="bi bi-instagram"></i>Instagram</Link>
              <Link href="#"
                    className="footer-a"
                    ref={(e: any) => {refs.current.socials.whatsapp = e}}
                    target="_blank"
              ><i className="bi bi-whatsapp"></i>WhatsApp</Link>
            </div>
          </div>
        </div>
      </div>
      <section id="copyright" ref={(e: any) => {refs.current.copyright = e}}>
        <p>&copy; 2026 Kuliner Nusantara di Jakarta. Seluruh hak cipta dilindungi.</p>
      </section>
    </footer>
  );
};