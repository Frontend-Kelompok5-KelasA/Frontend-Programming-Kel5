import React from "react";
import Image from "next/image";

export const Footer = () => {
    return (
        <footer>
            <div className="container-fluid footer-fill">
                <div className="row">
                    <div className="col-12 col-md-12 col-lg-5 order-3 order-md-3 order-lg-1 about">
                        <div id="footer-title">
                            <Image id="footer-logo" src="/logo.png" alt="logo footer" width={100} height={100} />
                            <h3>Kuliner Nusantara di Jakarta</h3>
                            <p>Menjelajahi cita rasa Nusantara di tengah hiruk-piruk Jakarta</p>
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
                            <a href="index.html" className="footer-a">Home</a>
                            <a href="explore.html" className="footer-a">Explore</a>
                            <a href="admin.html" className="footer-a">Admin</a>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4 order-2 order-md-2 order-lg-3 contacts">
                        <h3>Contact</h3>
                        <br />
                        <p><i className="bi bi-geo-alt-fill"></i>Jakarta, Indonesia</p>
                        <br />
                        <div className="footer-socials">
                            <a href="#" className="footer-a"><i className="bi bi-envelope-fill"></i>Email</a>
                            <a href="#" className="footer-a"><i className="bi bi-instagram"></i>Instagram</a>
                            <a href="#" className="footer-a"><i className="bi bi-whatsapp"></i>WhatsApp</a>
                        </div>
                    </div>
                </div>
            </div>
            <section id="copyright">
                <p>&copy; 2026 Kuliner Nusantara di Jakarta. Seluruh hak cipta dilindungi.</p>
            </section>
        </footer>
    );
};