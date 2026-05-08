import { useEffect, useState } from "react";
import hinhAnhApi from "../../api/hinhAnhApi";

function SanPhamChiTietImage({ spctId }) {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // ================= LOAD IMAGES =================
  const fetchImages = async () => {
    if (!spctId) return;

    try {
      const res = await hinhAnhApi.getBySPCT(spctId);
      setImages(res?.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [spctId]);

  // ================= UPLOAD =================
  const handleUpload = async () => {
    if (!file || !spctId) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("sanPhamChiTietId", spctId);

      await hinhAnhApi.create(formData);

      setFile(null);
      fetchImages();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await hinhAnhApi.delete(id);
      fetchImages();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Hình ảnh sản phẩm</h3>

      {/* UPLOAD */}
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Đang upload..." : "Upload"}
      </button>

      {/* LIST IMAGE */}
      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        {images.map((img) => (
          <div key={img.id} style={{ textAlign: "center" }}>
            <img
              src={`http://localhost:8080/uploads/${img.ten}`}
              alt=""
              width={100}
              height={100}
              style={{ objectFit: "cover" }}
            />

            <div>
              <button onClick={() => handleDelete(img.id)}>
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SanPhamChiTietImage;