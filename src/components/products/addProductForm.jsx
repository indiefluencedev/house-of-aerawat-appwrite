'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';

export default function AddProductForm({
  isOpen,
  onClose,
  onSubmit,
  initialData = {
    productName: '',
    description: '',
    price: '',
    category: '',
    images: [],
  },
  formMode = 'add',
  isLoading = false,
}) {
  const [productData, setProductData] = useState(initialData);
  const [dragActive, setDragActive] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const categories = [
    'Crystal',
    'Fine Jewellery',
    'Kalpatt',
    'Wooden Beads',
    'Treasure Gifts',
  ];

  // Update form when initialData changes (for editing)
  useEffect(() => {
    setProductData(initialData);
    // If editing and has existing images, set them up for preview
    if (initialData.images && initialData.images.length > 0) {
      setPreviewUrls(initialData.images);
    }
  }, [
    initialData.productName,
    initialData.description,
    initialData.price,
    initialData.category,
  ]);

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previewUrls]);

  const handleInputChange = (e) => {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setProductData({
      ...productData,
      [e.target.name]: value,
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter((file) => {
      // Check if it's an image
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return false;
      }

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }

      return true;
    });

    if (validFiles.length > 0) {
      setImageFiles((prev) => [...prev, ...validFiles]);

      // Create preview URLs
      validFiles.forEach((file) => {
        const previewUrl = URL.createObjectURL(file);
        setPreviewUrls((prev) => [...prev, previewUrl]);
      });
    }
  };

  const removeImage = (index) => {
    // Revoke the preview URL if it's a blob URL
    if (previewUrls[index] && previewUrls[index].startsWith('blob:')) {
      URL.revokeObjectURL(previewUrls[index]);
    }

    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    if (imageFiles.length === 0) return [];

    setUploadingImages(true);
    const uploadedUrls = [];

    try {
      // Create FormData for the API
      const formData = new FormData();
      imageFiles.forEach((file) => {
        formData.append('files', file);
      });

      // Upload via API route
      const response = await fetch('/api/products/upload-images', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload images');
      }

      return result.urls;
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Failed to upload images: ${error.message}`);
      return [];
    } finally {
      setUploadingImages(false);
    }
  };

  const validateForm = () => {
    const { productName, price, category } = productData;

    if (!productName || productName.trim() === '') {
      alert('Please enter a product name');
      return false;
    }

    if (!price || isNaN(price) || price <= 0) {
      alert('Please enter a valid price');
      return false;
    }

    if (!category || category.trim() === '') {
      alert('Please select a category');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Upload images first
    const uploadedImageUrls = await uploadImages();

    // Combine existing images (for edit mode) with newly uploaded ones
    const allImages = [...(productData.images || []), ...uploadedImageUrls];

    onSubmit({
      ...productData,
      price: parseFloat(productData.price),
      images: allImages,
    });
  };

  const handleCancel = () => {
    // Clean up preview URLs
    previewUrls.forEach((url) => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });

    setProductData({
      productName: '',
      description: '',
      price: '',
      category: '',
      images: [],
    });
    setImageFiles([]);
    setPreviewUrls([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-gray-500/30 flex justify-center items-center z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold'>
            {formMode === 'add' ? 'Add New Product' : 'Edit Product'}
          </h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Product Name */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Product Name
            </label>
            <input
              type='text'
              name='productName'
              value={productData.productName}
              onChange={handleInputChange}
              className='w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='Enter product name'
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Description
            </label>
            <textarea
              name='description'
              value={productData.description}
              onChange={handleInputChange}
              rows={3}
              className='w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
              placeholder='Enter product description'
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Price */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Price
              </label>
              <div className='relative'>
                <span className='absolute left-3 top-2 text-gray-500'>₹</span>
                <input
                  type='number'
                  name='price'
                  value={productData.price}
                  onChange={handleInputChange}
                  className='w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder='0.00'
                  step='0.01'
                  min='0'
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Category
              </label>
              <select
                name='category'
                value={productData.category}
                onChange={handleInputChange}
                className='w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                required
              >
                <option value=''>Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Media Upload */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Product Images
            </label>

            {/* Image Previews */}
            {previewUrls.length > 0 && (
              <div className='mb-4 grid grid-cols-2 md:grid-cols-3 gap-4'>
                {previewUrls.map((url, index) => (
                  <div key={index} className='relative group'>
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className='w-full h-32 object-cover rounded-lg border border-gray-200'
                    />
                    <button
                      type='button'
                      onClick={() => removeImage(index)}
                      className='absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className='space-y-2'>
                <div className='flex justify-center'>
                  <Upload className='h-8 w-8 text-pink-500' />
                </div>
                <div className='text-sm text-gray-600'>
                  <p className='font-medium'>Upload Product Images</p>
                  <p className='text-xs text-gray-500'>
                    Drag and drop images here, or browse (Max 5MB per image)
                  </p>
                </div>
                <input
                  type='file'
                  multiple
                  accept='image/*'
                  onChange={(e) => handleFiles(e.target.files)}
                  className='hidden'
                  id='file-upload'
                />
                <label
                  htmlFor='file-upload'
                  className='inline-block px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 cursor-pointer transition-colors'
                >
                  Browse Images
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className='flex justify-end space-x-3 pt-4 border-t'>
            <button
              type='button'
              onClick={handleCancel}
              className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={isLoading || uploadingImages}
            >
              {uploadingImages
                ? 'Uploading Images...'
                : isLoading
                ? 'Saving...'
                : formMode === 'add'
                ? 'Add product'
                : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
