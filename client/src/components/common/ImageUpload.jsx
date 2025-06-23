import React, { useRef, useState, useEffect } from 'react';

const ImageUpload = ({ label = "Upload Image", onChange, value, name }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(value || '');

  useEffect(() => {
    if (value && typeof value === 'string') {
      setPreview(value);
    }
  }, [value]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      onChange({ target: { name, value: reader.result } }); // Pass base64 or blob string back to parent
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontWeight: 500, marginBottom: 8 }}>
        {label}
      </label>

      {preview && (
        <div style={{ marginBottom: 8 }}>
          <img
            src={preview}
            alt="Preview"
            style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: 8 }}
          />
        </div>
      )}

      <button type="button" onClick={() => fileInputRef.current.click()}>
        Choose Image
      </button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ImageUpload;
