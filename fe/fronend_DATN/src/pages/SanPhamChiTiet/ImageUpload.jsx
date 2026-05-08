export default function ImageUpload({
  images,
  setFile,
  file,
  onUpload,
  onDeleteImage,
  editingId
}) {
  return (
    <div className="upload-box">
      <h3>Ảnh biến thể</h3>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button onClick={onUpload} disabled={!editingId}>
        Upload
      </button>

      <div className="image-list">
        {images.length === 0 ? (
          <p>Chưa có ảnh</p>
        ) : (
          images.map(img => (
            <div key={img.id} className="img-item">
              <img src={img.ten} width={100} alt="" />
              <button onClick={() => onDeleteImage(img.id)}>Xóa</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}