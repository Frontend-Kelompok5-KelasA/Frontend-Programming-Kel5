import Image from "next/image";
import { Footer } from "../../components/Footer";

export default function Home() {
    return (
        <main>
        <nav className="navbar navbar-expand-md sticky-top">
            <div className="container-fluid">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav-hamburger" aria-controls="nav-hamburger" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <a className="navbar-brand" href="index.html">
                    <Image className="nav-logo" src="/logo.png" alt="logo buat nav" width={100} height={100} />
                </a>
                <div className="navbar-profile dropdown ms-auto order-md-last ms-md-0 d-none" id="profile-out">
                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <Image className="profile-picture" src="/profile.png" alt="logo profile" width={100} height={100} />
                        <span className="d-none d-md-inline">Profile</span>
                    </a>
                    <div className="dropdown-menu dropdown-menu-end">
                        <span className="d-inline d-sm-none username">Profile
                            <hr className="dropdown-hr" />
                        </span>
                        <a className="dropdown-item" href="login.html">Log In</a>
                        <a className="dropdown-item" href="sign-up.html">Sign Up</a>
                    </div>
                </div>
                <div className="navbar-profile dropdown ms-auto order-md-last ms-md-0 d-none" id="profile-logged">
                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <Image className="profile-picture" src="/profile.png" alt="profile-picture-img" width={100} height={100} />
                        <span className="d-none d-md-inline">Profile</span>
                    </a>
                    <div className="dropdown-menu dropdown-menu-end">
                        <span className="d-inline d-sm-none username">Profile
                            <hr className="dropdown-hr"/>
                        </span>
                        <a className="dropdown-item" href="profile.html">View Profile</a>
                        <a className="dropdown-item" href="/api/logout">Sign Out</a>
                    </div>
                </div>
                <div className="collapse navbar-collapse justify-content-center" id="nav-hamburger">
                    <div className="navbar-nav">
                        <a className="nav-link" href="index.html">Home</a>
                        <a className="nav-link" href="explore.html">Explore</a>
                        <a className="nav-link" href="admin.html">Admin</a>
                    </div>
                </div>
            </div>
        </nav>
        
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