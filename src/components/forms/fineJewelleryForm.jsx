'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Trash2, Plus, Minus } from 'lucide-react';

export default function FineJewelleryForm({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  formMode = 'add',
  isLoading = false,
}) {
  const defaultData = {
    name: '',
    productType: '',
    description: '',
    karat: '',
    additionalInformation: [{ key: '', value: '' }],
    hasPricing: false,
    price: '',
    images: [],
  };

  const [productData, setProductData] = useState(initialData || defaultData);
  const [dragActive, setDragActive] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const productTypes = ['Earring', 'Chain', 'Rings/Bands'];

  // Update form when initialData changes (for editing)
  useEffect(() => {
    const dataToSet = initialData || defaultData;
    setProductData(dataToSet);

    // If editing and has existing images, set them up for preview
    if (dataToSet.images && dataToSet.images.length > 0) {
      setPreviewUrls(dataToSet.images);
    } else {
      setPreviewUrls([]);
    }
  }, [initialData]);

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

  const handleAdditionalInfoChange = (index, field, value) => {
    if (!productData || !productData.additionalInformation) return;

    const updatedInfo = [...productData.additionalInformation];
    updatedInfo[index][field] = value;
    setProductData({
      ...productData,
      additionalInformation: updatedInfo,
    });
  };

  const addAdditionalInfoField = () => {
    if (!productData) return;

    setProductData({
      ...productData,
      additionalInformation: [
        ...(productData.additionalInformation || []),
        { key: '', value: '' },
      ],
    });
  };

  const removeAdditionalInfoField = (index) => {
    if (!productData || !productData.additionalInformation) return;

    if (productData.additionalInformation.length > 1) {
      const updatedInfo = productData.additionalInformation.filter(
        (_, i) => i !== index
      );
      setProductData({
        ...productData,
        additionalInformation: updatedInfo,
      });
    }
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

    try {
      // Return the imageFiles array for processing by the parent component
      return imageFiles;
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Failed to prepare images: ${error.message}`);
      return [];
    } finally {
      setUploadingImages(false);
    }
  };

  const validateForm = () => {
    if (!productData) {
      alert('Form data is missing');
      return false;
    }

    const { name, productType, karat, hasPricing, price } = productData;

    if (!name || name.trim() === '') {
      alert('Please enter a product name');
      return false;
    }

    if (!productType || productType.trim() === '') {
      alert('Please select a product type');
      return false;
    }

    if (!karat || karat.trim() === '') {
      alert('Please enter karat information');
      return false;
    }

    if (hasPricing && (!price || isNaN(price) || price <= 0)) {
      alert('Please enter a valid price');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Get image files for upload
    const imagesToUpload = await uploadImages();

    // Filter out empty additional information fields
    const filteredAdditionalInfo = productData.additionalInformation.filter(
      (info) => info.key.trim() && info.value.trim()
    );

    // Prepare form data
    const formData = {
      ...productData,
      price: productData.hasPricing ? parseFloat(productData.price) : null,
      additionalInformation: filteredAdditionalInfo,
      images: productData.images || [], // Existing images for edit mode
    };

    // Call onSubmit with form data and image files
    onSubmit(formData, imagesToUpload);
  };

  const handleCancel = () => {
    // Clean up preview URLs
    previewUrls.forEach((url) => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });

    setProductData(defaultData);
    setImageFiles([]);
    setPreviewUrls([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-gray-500/30 flex justify-center items-center z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold'>
            {formMode === 'add'
              ? 'Add New Fine Jewellery'
              : 'Edit Fine Jewellery'}
          </h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Name */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Name
            </label>
            <input
              type='text'
              name='name'
              value={productData?.name || ''}
              onChange={handleInputChange}
              className='w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='Enter jewellery name'
              required
            />
          </div>

          {/* Product Type */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Product Type
            </label>
            <select
              name='productType'
              value={productData.productType}
              onChange={handleInputChange}
              className='w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              required
            >
              <option value=''>Select product type</option>
              {productTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
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

          {/* Karat */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Karat
            </label>
            <input
              type='text'
              name='karat'
              value={productData.karat}
              onChange={handleInputChange}
              className='w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='e.g., 18K, 22K, 24K'
              required
            />
          </div>

          {/* Additional Information */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Additional Information
            </label>
            <div className='space-y-3'>
              {(productData?.additionalInformation || []).map((info, index) => (
                <div key={index} className='flex gap-2 items-start'>
                  <input
                    type='text'
                    value={info.key || ''}
                    onChange={(e) =>
                      handleAdditionalInfoChange(index, 'key', e.target.value)
                    }
                    className='flex-1 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='e.g., Material, Chain Length'
                  />
                  <input
                    type='text'
                    value={info.value || ''}
                    onChange={(e) =>
                      handleAdditionalInfoChange(index, 'value', e.target.value)
                    }
                    className='flex-1 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='e.g., 18K Gold with Natural Diamonds'
                  />
                  {(productData?.additionalInformation?.length || 0) > 1 && (
                    <button
                      type='button'
                      onClick={() => removeAdditionalInfoField(index)}
                      className='p-2 text-red-500 hover:text-red-700'
                    >
                      <Minus size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type='button'
                onClick={addAdditionalInfoField}
                className='flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm'
              >
                <Plus size={16} />
                Add More Information
              </button>
            </div>
          </div>

          {/* Pricing Section */}
          <div className='border border-gray-200 rounded-lg p-4'>
            <div className='flex items-center space-x-3 mb-3'>
              <input
                type='checkbox'
                name='hasPricing'
                checked={productData.hasPricing}
                onChange={handleInputChange}
                className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
              />
              <label className='text-sm font-medium text-gray-700'>
                Add pricing for this product
              </label>
            </div>

            {productData.hasPricing && (
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
                  />
                </div>
              </div>
            )}
          </div>

          {/* Image Upload */}
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
                ? 'Add Fine Jewellery'
                : 'Update Fine Jewellery'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
