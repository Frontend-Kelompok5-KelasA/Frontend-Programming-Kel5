import Image from "next/image";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

export default function Profile() {
    return (
        <main>
            <Navbar />
            <div className="main-container">
                {/* <!-- bagian biodata --> */}
                <Image className="gambar-logo" src="/profile.png" alt="logo" width={360} height={360}/>

                <div className="biodata">
                    <h3 id="profile-name">User&apos;s Name</h3>
                    <p id="profile-fav">User&apos;s Fav Food/Restaurant</p>
                </div>

                {/* <!-- tabel isi --> */}
                <section className="list-review container" id="review-section">
                    <h3 id="review-title">My Reviews</h3>
                    <p id="review-summary">Loading reviews...</p>

                    <input type="search" id="review-search" placeholder="Search reviews..."/>

                    <div className="review-table-wrap">
                        <table className="review-table">
                            <thead id="review-head"></thead>
                            <tbody id="review-body"></tbody>
                        </table>
                    </div>
                </section>
            </div>
            <Footer />
        </main>
    );
}