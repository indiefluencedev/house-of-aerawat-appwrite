'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Sample data for Crystals products - replace with database fetch later
const sampleProducts = [
  {
    id: 'cr-001',
    name: 'Amethyst Healing Crystal',
    price: 1200,
    originalPrice: 1500,
    image: '/assets/products/product1.png',
    description:
      'Natural amethyst crystal for spiritual healing and meditation.',
    products: 'crystals',
    inStock: true,
    featured: true,
  },
  {
    id: 'cr-002',
    name: 'Rose Quartz Heart Set',
    price: 800,
    originalPrice: 1000,
    image: '/assets/products/product1.png',
    description: 'Beautiful rose quartz hearts for love and emotional healing.',
    products: 'crystals',
    inStock: true,
    featured: false,
  },
  {
    id: 'cr-003',
    name: '7 Chakra Crystal Set',
    price: 2500,
    originalPrice: 3000,
    image: '/assets/products/product1.png',
    description: 'Complete set of 7 chakra crystals for energy balancing.',
    products: 'crystals',
    inStock: true,
    featured: true,
  },
];

export default function CrystalsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [filterBy, setFilterBy] = useState('all');

  useEffect(() => {
    // Simulate API call - replace with actual database fetch later
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // For now, use sample data
        setProducts(sampleProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredAndSortedProducts = products
    .filter((product) => {
      if (filterBy === 'all') return true;
      if (filterBy === 'inStock') return product.inStock;
      if (filterBy === 'featured') return product.featured;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'featured':
        default:
          return b.featured - a.featured;
      }
    });

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#9333EA] mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading Crystal Products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section */}
      <div className='bg-gradient-to-r from-[#9333EA] to-[#A855F7] text-white py-16'>
        <div className='max-w-7xl mx-auto px-4 text-center'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4'>Crystals</h1>
          <p className='text-xl md:text-2xl text-purple-100'>
            Harness the power of nature&apos;s healing energy
          </p>
        </div>
      </div>

      {/* Products Section */}
      <div className='max-w-7xl mx-auto px-4 py-12'>
        {/* Filters and Sorting */}
        <div className='flex flex-col md:flex-row justify-between items-center mb-8 gap-4'>
          <div className='flex items-center gap-4'>
            <label
              htmlFor='filter'
              className='text-sm font-medium text-gray-700'
            >
              Filter:
            </label>
            <select
              id='filter'
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className='border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9333EA]'
            >
              <option value='all'>All Products</option>
              <option value='featured'>Featured</option>
              <option value='inStock'>In Stock</option>
            </select>
          </div>

          <div className='flex items-center gap-4'>
            <label htmlFor='sort' className='text-sm font-medium text-gray-700'>
              Sort by:
            </label>
            <select
              id='sort'
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className='border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9333EA]'
            >
              <option value='featured'>Featured</option>
              <option value='name'>Name</option>
              <option value='price-low'>Price: Low to High</option>
              <option value='price-high'>Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {filteredAndSortedProducts.map((product) => (
            <div
              key={product.id}
              className='bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300'
            >
              <div className='relative'>
                <Image
                  src={product.image}
                  alt={product.name}
                  width={400}
                  height={400}
                  className='w-full h-64 object-cover'
                />
                {product.featured && (
                  <span className='absolute top-2 left-2 bg-[#D4AF37] text-white px-2 py-1 text-xs font-semibold rounded'>
                    Featured
                  </span>
                )}
                {!product.inStock && (
                  <span className='absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded'>
                    Out of Stock
                  </span>
                )}
              </div>

              <div className='p-6'>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                  {product.name}
                </h3>
                <p className='text-gray-600 text-sm mb-4'>
                  {product.description}
                </p>

                <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center gap-2'>
                    <span className='text-2xl font-bold text-[#9333EA]'>
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className='text-sm text-gray-500 line-through'>
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className='flex gap-2'>
                  <Link
                    href={`/products/crystals/${product.id}`}
                    className='flex-1 bg-[#9333EA] text-white px-4 py-2 rounded-md text-center hover:bg-[#A855F7] transition-colors'
                  >
                    View Details
                  </Link>
                  <button
                    className='bg-[#D4AF37] text-white px-4 py-2 rounded-md hover:bg-[#c49d2a] transition-colors'
                    disabled={!product.inStock}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAndSortedProducts.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-gray-500 text-lg'>
              No products found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
