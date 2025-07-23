'use client';

import { useState } from 'react';
import AdminLayout from '@/layouts/adminLayout';
import FineJewelleryForm from '@/components/forms/fineJewelleryForm';
import { Search, Trash2 } from 'lucide-react';

export default function FineJewelleryPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const products = [
    {
      id: 1,
      name: 'Diamond Dewleaf',
      inventory: 100,
      price: '$14.99',
      productType: 'Earrings',
    },
    {
      id: 2,
      name: 'Tube Bar Chain',
      inventory: 120,
      price: '$9.99',
      productType: 'Chains',
    },
    {
      id: 3,
      name: 'Solitaire Serenity',
      inventory: 300,
      price: '$5.99',
      productType: 'Rings/Bands',
    },
  ];

  const handleAddProduct = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleSubmitForm = (productData) => {
    // Handle form submission logic here
    console.log('Product data:', productData);
    // You can add API call logic here
    setIsFormOpen(false);
  };

  return (
    <AdminLayout>
      <div className='p-6'>
        {/* Header */}
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-semibold text-gray-900'>
            Fine Jewellery
          </h1>
          <button
            onClick={handleAddProduct}
            className='bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors'
          >
            Add product
          </button>
        </div>

        {/* Search Bar */}
        <div className='relative mb-6'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <Search className='h-4 w-4 text-gray-400' />
          </div>
          <input
            type='text'
            placeholder='Search products'
            className='w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300'
          />
        </div>

        {/* Products Table */}
        <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
          {/* Table Header */}
          <div className='grid grid-cols-6 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200'>
            <div className='text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Image
            </div>
            <div className='text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Product
            </div>
            <div className='text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Inventory
            </div>
            <div className='text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Price
            </div>
            <div className='text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Product Type
            </div>
            <div className='text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Actions
            </div>
          </div>

          {/* Table Rows */}
          {products.map((product, index) => (
            <div
              key={product.id}
              className='grid grid-cols-6 gap-4 px-6 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors'
            >
              {/* Image */}
              <div className='flex items-center'>
                <div className='w-10 h-10 bg-gray-200 rounded'></div>
              </div>

              {/* Product */}
              <div className='flex items-center'>
                <span className='text-sm font-medium text-gray-900'>
                  {product.name}
                </span>
              </div>

              {/* Inventory */}
              <div className='flex items-center'>
                <span className='text-sm text-gray-700'>
                  {product.inventory}
                </span>
              </div>

              {/* Price */}
              <div className='flex items-center'>
                <span className='text-sm text-gray-700'>{product.price}</span>
              </div>

              {/* Product Type */}
              <div className='flex items-center'>
                <span className='text-sm text-gray-700'>
                  {product.productType}
                </span>
              </div>

              {/* Actions */}
              <div className='flex items-center'>
                <button className='text-gray-400 hover:text-red-500 transition-colors'>
                  <Trash2 className='h-4 w-4' />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Fine Jewellery Form Modal */}
        <FineJewelleryForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleSubmitForm}
          formMode='add'
        />
      </div>
    </AdminLayout>
  );
}
