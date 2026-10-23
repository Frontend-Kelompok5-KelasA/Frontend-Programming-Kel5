import { Footer } from "../../components/Footer";

export default function Admin() {
    return (
        <main>
            <Navbar />

            <section id="dashboard">
                <h1>Dashboard Admin</h1>

                <div id="dashboard-content" className="dashboard-content row g-4">
                    <div id="card-dashboard" className="col-12 col-md-4">
                        <a href="/user_detail" className="card stat-card" data-key="user">
                            <img src="/images/profile_icon.jpg" />
                            <div className="stat-teks">
                                <span className="stat-label">Jumlah User</span>
                                <span className="stat-number">–</span>
                            </div>         
                        </a>
                    </div>

                    <div className="card-dashboard col-12 col-md-4">
                        <a href="/restoran_detail" className="card stat-card" data-key="restoran">
                            <img src="/images/shop.png" />
                            <div className="stat-teks">
                                <span className="stat-label">Jumlah Restoran</span>
                                <span className="stat-number">–</span>
                            </div> 
                        </a>
                    </div>

                    <div className="card-dashboard col-12 col-md-4">
                        <a href="/review_detail" className="card stat-card" data-key="review">
                            <img src="/images/review.png" />
                            <div className="stat-teks">
                                <span className="stat-label">Jumlah Review</span>
                                <span className="stat-number">–</span>
                            </div> 
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}