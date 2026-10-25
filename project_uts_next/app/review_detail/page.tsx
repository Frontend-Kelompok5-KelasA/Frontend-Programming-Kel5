import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

export default function ReviewDetail() {
    return (
        <main>
            <Navbar />
            <div className="halaman-tabel">
                <h1>Daftar Review</h1>
                <div className="table-wrap lebar">
                    <table className="table table-bordered table-striped table-hover align-middle mb-0">
                        <thead>
                            <tr>
                                <th scope="col">No</th>
                                <th scope="col">Nama User</th>
                                <th scope="col">Tanggal Review</th>
                                <th scope="col">Restoran</th>
                                <th scope="col">Rating</th>
                                <th scope="col">Komentar</th>
                            </tr>
                        </thead>
                        <tbody id="tabel-review-body">
                            <tr>
                                <td colSpan={6} className="text-center">Memuat data...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </main>
    );
}