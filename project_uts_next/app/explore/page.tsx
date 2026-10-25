import Image from "next/image";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

export default function Home() {
    return (
        <main>
        <Navbar />
        
        <div className="main-container">
            {/* search bar */}
            <div className="search-filter-section">
                <input type="search" id="search-rest" placeholder="Search..." />
                <button id="open-m-filter">Filter
                    <Image src="/filter.png" alt="logo filter" width={100} height={100} />
                </button>

                <div id="modal">
                    <div className="modal-inner">
                        <button id="cancel-filter" aria-label="Tutup">&times;</button>
                        <h1>Filter Your Restaurant!</h1>
                        <h2>Asal Daerah Nusantara</h2>
                        <div id="asal-daerah-filter"></div>
                        <hr />
                        <h2>Jenis Makanan</h2>
                        <div id="jenis-filter"></div>
                        <hr />
                        <h2>Price Range</h2>
                        <div id="price-filter"></div>
                        <hr />
                        <button id="close-filter">Done</button>
                    </div>
                </div>
            </div>

            <button id="matiin-filter">Cancel Filter</button>

            <hr />

            <div className="list-resto">
                <h2>Explore Some Restaurant</h2>
                <div className="food-list d-flex flex-wrap justify-content-center gap-4" id="food-list">
                    {/* Card di-generate otomatis dari /api/resto lewat script.js */}
                </div>
            </div>
        </div>

        <div id="detail-modal">
            <div className="modal-inner detail-inner">
                <button id="close-detail" aria-label="Tutup">&times;</button>
                <div id="detail-content">
                    {/* Modal detail restoran diisi di script.js) */}
                </div>
                </div>
        </div>
        <Footer />
        </main>
    );
}