import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import api from '../api'; // Adjust the import based on your project structure

const ScanUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('idle'); // 'idle', 'in progress', 'success', 'error'
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const fileInputRef = useRef(null);


  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFile = (file) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    uploadFile(file);
  };

  const uploadFile = async (file) => {
    setUploadStatus('in progress');
    setIsLoading(true);

    const formData = new FormData();
    formData.append('scan', file);
    formData.append('model_id', '2');

    try {
      const response = await api.post('api/users/predict/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Scan uploaded:', response.data);
      setUploadStatus('success');
      setIsLoading(false);
      setResults(response.data);
      console.log(response.data.normal)
      console.log(response.data.lungop)
      console.log(response.data.pneumonia)
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus('error');
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  const getIcon = () => {
    if (isLoading) return <Loader className="w-6 h-6 text-gray-500 animate-spin" />;
    if (uploadStatus === 'success') return <CheckCircle className="w-6 h-6 text-green-500" />;
    if (uploadStatus === 'error') return <AlertCircle className="w-6 h-6 text-red-500" />;
    return <Upload className="w-6 h-6 text-gray-500" />;
  };

  return (
    <div className="p-8">
      <div
        className={`border-2 border-dashed p-6 rounded-lg text-center cursor-pointer transition-all
          ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}`}
        onClick={() => fileInputRef.current.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          {getIcon()}
          <p className="text-gray-700 font-medium">Click or drag a scan to upload</p>
          {selectedFile && <p className="text-sm text-gray-500">{selectedFile.name}</p>}
        </div>
      </div>

      {previewUrl && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Preview:</h2>
          <img src={previewUrl} alt="Scan Preview" className="w-full max-w-md rounded-lg shadow" />*
          <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-md text-center">
            <h3 className="text-lg font-semibold mb-2">Prediction Result:</h3>
            <p>Normal: {results ? results.normal : "No results yet"}</p>
            <p>Lung Opacity: {results ? results.lungop : "No results yet"}</p>
             <p>Pneumonia: {results ? results.pneumonia : "No results yet"}</p>
          </div>
        </div>
      )}


    </div>
  );
};

export default ScanUpload;
