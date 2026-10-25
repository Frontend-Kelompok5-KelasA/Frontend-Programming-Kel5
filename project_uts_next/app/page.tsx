import Image from "next/image";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";

export default function Home() {
  return (
    <main>
      <Navbar />

        {/* content */}
        <div className="main-container">
            {/* hero */}
            <div className="hero">
                <Image className="gambar-logo" src="/logo.png" alt="gambar logo" width={500} height={500} />

                <div className="hero-text">
                    <h1>Serving you the flavors of Nusantara. Explore Indonesia, one delicious dish at a time</h1>
                    <p>Discover Indonesia&apos;s beloved flavors, from traditional favorites to hidden culinary gems scattered across Jakarta.</p>
                </div>
            </div>

            {/* facts */}
            <div className="facts">
                <div className="facts-title">
                    <h2>Taste of Indonesia, Right in Jakarta</h2>
                    <p>Jakarta brings together flavors from across the Indonesian archipelago.</p>
                </div>
                <div className="container-fluid facts-fill">
                    <div className="row gy-4">
                        <div className="col-12 col-md-6 col-lg-3 areas-in-jakarta">
                            <div className="the-facts">
                                <Image className="facts-image" src="/peta-jakarta.png" alt="peta-jakarta" width={500} height={500} />
                                <h2>5 Areas of Jakarta</h2>
                                <p>Discover Nusantara cuisine spread across Central, South, East, West, and North Jakarta.</p>
                            </div>
                        </div>

                        <div className="col-12 col-md-6 col-lg-3 culinary-choices">
                            <div className="the-facts">
                                <Image className="facts-image" src="/rendang.png" alt="rendang" width={500} height={500} />
                                <h2>100+ Culinary Choices</h2>
                                <p>Explore a wide variety of traditional Indonesian dishes available throughout the city.</p>
                            </div>
                        </div>

                        <div className="col-12 col-md-6 col-lg-3 nusantara-in-one-city">
                            <div className="the-facts">
                                <Image className="facts-image" src="/kuliner.png" alt="gambar facts" width={500} height={500} />
                                <h2>Nusantara in One City</h2>
                                <p>From Padang cuisine to Betawi specialities, Jakarta offers flavors from different parts of Indonesia.</p>
                            </div>
                        </div>

                        <div className="col-12 col-md-6 col-lg-3 a-city-of-culinary-diversity">
                            <div className="the-facts">
                                <Image className="facts-image" src="/monas.png" alt="gambar monas" width={500} height={500} />
                                <h2>A City of Culinary Diversity</h2>
                                <p>Jakarta&apos;s diverse communities have brought culinary traditions from across Indonesia into the city.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* special */}
            <div className="special">
                <div className="special-title">
                    <h1>What Makes Nusantara Cuisine Special in Jakarta?</h1>
                    <p>Different regions, traditions, and flavors come together in one city.</p>
                </div>
                <div id="special-carousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="7500" data-bs-pause="false">
                    <div className="carousel-inner">
                        <div className="carousel-item active special-content">
                            <Image src="/flavors.jpg" alt="Diverse Flavors" width={2000} height={2000} />
                            <div className="carousel-caption">
                                <h2>Diverse Flavors</h2>
                                <p>Jakarta offers dishes with a wide range of flavors, from spicy and savory to sweet and rich.</p>
                            </div>
                        </div>
                        <div className="carousel-item special-content">
                            <Image src="/regional-variety.jpg" alt="Regional Variety" width={2000} height={2000} />
                            <div className="carousel-caption">
                                <h2>Regional Variety</h2>
                                <p>Find culinary traditions from Sumatra, Java, Sulawesi, and other regions across Jakarta.</p>
                            </div>
                        </div>
                        <div className="carousel-item special-content">
                            <Image src="/jakarta-culinary.jpg" alt="Cultural Heritage" width={2000} height={2000} />
                            <div className="carousel-caption">
                                <h2>Cultural Heritage</h2>
                                <p>Traditional dishes preserve the culinary traditions and cultural identity of communities living in Jakarta.</p>
                            </div>
                        </div>
                        <div className="carousel-item special-content">
                            <Image src="/jakarta-city.jpg" alt="One City, Many Traditions" width={2000} height={2000} />
                            <div className="carousel-caption">
                                <h2>One City, Many Traditions</h2>
                                <p>The city&apos;s diverse population brings together culinary traditions from different parts of Indonesia.</p>
                            </div>
                        </div>
                    </div>
                    <a className="carousel-control-prev" type="button" data-bs-target="#special-carousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="sr-only"></span>
                    </a>
                    <a className="carousel-control-next" type="button" data-bs-target="#special-carousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only"></span>
                    </a>
                </div>
            </div>

            {/* popular foods */}
            <div className="popular-food">
                <h2>Popular Dishes</h2>
                <p>Our most loved dishes by customers</p>

                <div className="popular-wrapper">
                    <div id="popular-carousel" className="carousel slide" data-bs-ride="false" data-bs-interval="false">
                        <div className="carousel-inner" id="popular-list">
                            {/* Slide & card di-generate dari /api/resto lewat script.js */}
                        </div>
                    </div>

                    <button id="popular-prev" className="popular-btn popular-btn-prev d-none"
                            type="button" data-bs-target="#popular-carousel" data-bs-slide="prev" aria-label="Sebelumnya">
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    <button id="popular-next" className="popular-btn popular-btn-next d-none"
                            type="button" data-bs-target="#popular-carousel" data-bs-slide="next" aria-label="Berikutnya">
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </div>
            </div>

            {/* start explore */}
            <div className="start-explore">
                <div className="container-fluid exploring p-0">
                    <div className="row g-0">
                        <div className="col-12 col-lg-6 explore-images">
                            <div id="explore-carousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000" data-bs-pause="false">
                                <div className="carousel-inner">
                                    {/* Slide gambar di-generate dari /api/resto lewat script.js */}
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-lg-6 explore-text">
                            <h1>Start Exploring Jakarta&apos;s Culinary Flavors</h1>
                            <p>From traditional Betawi dishes to flavors brought from across the archipelago, discover Nusantara cuisine waiting to be explored throughout Jakarta.</p>
                            <button id="explore-food-button">Start Exploring</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </main>
  );
}
