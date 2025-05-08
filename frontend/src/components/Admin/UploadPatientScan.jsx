import React, { useState } from "react";
import api from "../../api";

const UploadPatientScan = ({ patientId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("scan_image", selectedFile);

    try {
      await api.patch(`/api/users/admin/patients/${patientId}/upload-scan/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadStatus("✅ Scan uploaded successfully!");
    } catch (error) {
      console.error(error);
      setUploadStatus("❌ Failed to upload scan.");
    }
  };

  return (
    <div className="p-6 border rounded-2xl shadow-lg bg-white max-w-md w-full transition-all duration-300">
  <h2 className="text-xl font-bold text-gray-800 mb-4">
    Upload Scan for <span className="text-blue-600 font-semibold">Patient #{patientId}</span>
  </h2>

  <label className="block mb-4">
    <span className="text-sm text-gray-600">Choose an image:</span>
    <input
      type="file"
      onChange={handleFileChange}
      accept="image/*"
      className="mt-1 w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </label>

  {previewUrl && (
    <div className="mb-4 flex justify-center">
      <img
        src={previewUrl}
        alt="Preview"
        className="w-48 h-48 object-cover rounded-lg border border-gray-200 shadow-md"
      />
    </div>
  )}

  <button
    onClick={handleUpload}
    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
  >
    Upload Scan
  </button>

  {uploadStatus && (
    <p className="mt-3 text-sm text-center text-gray-600">{uploadStatus}</p>
  )}
</div>

  );
};

export default UploadPatientScan;
