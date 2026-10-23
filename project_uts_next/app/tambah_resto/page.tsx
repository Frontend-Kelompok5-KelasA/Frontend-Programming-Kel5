import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function AddResto() {
    return (
        <main>
            <Navbar />

            <div className="kotak-form">
                <h1>Tambah Restoran</h1>

                <form id="form-resto">

                    <div className="mb-3">
                        <label htmlFor="id" className="form-label">ID Restoran</label>
                        <input type="text" className="form-control" id="id" name="id"
                            placeholder="ex: made-01" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Nama Restoran</label>
                        <input type="text" className="form-control" id="name" name="name"
                            placeholder="ex: Warung Guling Pak Made" required />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="city" className="form-label">Kota</label>
                        <select className="form-select" id="city" name="city">
                            <option value="">-- Pilih Kota --</option>
                            <option value="Jakarta Pusat">Jakarta Pusat</option>
                            <option value="Jakarta Selatan">Jakarta Selatan</option>
                            <option value="Jakarta Timur">Jakarta Timur</option>
                            <option value="Jakarta Barat">Jakarta Barat</option>
                            <option value="Jakarta Utara">Jakarta Utara</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="place" className="form-label">Alamat</label>
                        <textarea className="form-control" id="place" name="place" rows= {3}
                                placeholder="ex: Ruko Jl. Pantai Indah Kapuk No.29 Blk A, Kecamatan Penjaringan, Daerah Khusus Ibukota Jakarta 14470"></textarea>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="desc" className="form-label">Deskripsi</label>
                        <textarea className="form-control" id="desc" name="desc" rows=  {4}
                                placeholder="ex: Restoran spesialis babi guling bergaya fusion Medan-Bali pertama di Jakarta..."></textarea>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="cat" className="form-label">Kategori</label>
                        <select className="form-select" id="cat" name="cat">
                            <option value="">-- Pilih Kategori --</option>
                            <option value="Makanan Berat">Makanan Berat</option>
                            <option value="Minuman">Minuman</option>
                            <option value="Camilan">Jajanan Kue</option>
                            <option value="Dessert">Lainnya</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="tag" className="form-label">Asal Daerah</label>
                        <input type="text" className="form-control" id="tag" name="tag"
                            placeholder="ex: Bali" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="status" className="form-label">Status</label>
                        <select className="form-select" id="status" name="status">
                            <option value="">-- Pilih Status --</option>
                            <option value="Halal">Halal</option>
                            <option value="Non-Halal">Non-Halal</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="open_hour" className="form-label">Jam Buka</label>
                        <input type="text" className="form-control" id="open_hour" name="open_hour"
                            placeholder=" ex: Mon - Sun: 10.00 - 22.00" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="price" className="form-label">Range Harga</label>
                        <select className="form-select" id="price" name="price">
                            <option value="">-- Pilih Range Harga --</option>
                            <option value="0-50.000">Kurang dari Rp50.000</option>
                            <option value="50.000-75.000">Rp50.000 - Rp75.000</option>
                            <option value="75.000-100.000">Rp75.000 - Rp100.000</option>
                            <option value="100.000-999.999">Lebih dari Rp100.000</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="rating" className="form-label">Rating</label>
                        <input type="number" className="form-control" id="rating" name="rating"
                            min="0" max="5" step="0.1" placeholder="ex: 4.9" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="official_website" className="form-label">Website <span className="opsional">(opsional)</span></label>
                        <input type="url" className="form-control" id="official_website" name="official_website"
                            placeholder="ex: https://..." />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="instagram" className="form-label">Instagram <span className="opsional">(opsional)</span></label>
                        <input type="url" className="form-control" id="instagram" name="instagram"
                            placeholder="ex: https://www.instagram.com/warunggulingpakmade" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="image" className="form-label">Nama File Gambar</label>
                        <input type="text" className="form-control" id="image" name="image"
                            placeholder="ex: made.png" />
                        <small className="text-muted">File gambar dimasukkan di folder <code>images/</code></small>
                    </div>

                    <button type="submit" className="btn-tambah w-100 mt-2">Simpan</button>
                    <p id="pesan-form" className="mt-3 text-center"></p>

                </form>
            </div>
        </main>
    )
}