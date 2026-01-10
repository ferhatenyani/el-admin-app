import { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';

const UploadImageInput = ({ value, onChange, label = 'Book Cover', existingImageUrl = null, aspectRatio = 'vertical' }) => {
  const [preview, setPreview] = useState(null);

  // Initialize preview based on value or existingImageUrl
  useEffect(() => {
    if (value instanceof File) {
      // New file selected - create object URL
      const previewUrl = URL.createObjectURL(value);
      setPreview(previewUrl);

      // Cleanup function to revoke object URL
      return () => URL.revokeObjectURL(previewUrl);
    } else if (existingImageUrl) {
      // Existing image from server
      setPreview(existingImageUrl);
    } else {
      setPreview(null);
    }
  }, [value, existingImageUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Pass File object to parent
      onChange(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
  };

  // Determine aspect ratio classes based on prop
  const aspectClasses = aspectRatio === 'horizontal' ? 'aspect-[3/2]' : 'aspect-[2/3]';
  const maxWidthPreview = aspectRatio === 'horizontal' ? 'max-w-[320px]' : 'max-w-[180px]';
  const maxWidthUpload = aspectRatio === 'horizontal' ? 'max-w-[400px]' : 'max-w-[280px]';

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {preview ? (
        <div className={`relative w-full ${maxWidthPreview} mx-auto ${aspectClasses} bg-gray-100 rounded-lg overflow-hidden group`}>
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <label className={`w-full ${maxWidthUpload} mx-auto ${aspectClasses} flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors`}>
          <Upload className="w-10 h-10 text-gray-400 mb-2" />
          <span className="text-sm text-gray-600">Click to upload image</span>
          <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};

export default UploadImageInput;
