'use client';
import { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  return (
    <div className='lg:min-h-screen mb-10 py-12 lg:mb-0'>
      <div className='max-w-[1004px] mx-auto px-4'>
        <div className='flex flex-col lg:flex-row lg:items-start gap-12'>
          {/* Left side - Contact Image */}
          <div className='lg:w-1/2 flex justify-center lg:justify-center lg:block'>
            <div className='lg:w-[350px] lg:h-[350px] xl:w-[350px] xl:h-[350px] flex items-center justify-center lg:mt-[120px]'>
              <img
                src='/assets/svgs/contactimg.svg'
                alt='Contact Us'
                className='w-full h-full object-contain'
              />
            </div>
          </div>

          {/* Right side - Contact Form */}
          <div className=' w-full'>
            <div className='bg-white sm:py-8'>
              <h2 className='text-[28px] md:text-[32px] text-left font-bold text-gray-800 mb-8'>
                Get in touch with us
              </h2>

              <div className='space-y-6'>
                {/* First Name and Last Name Row */}
                <div className='grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      First Name*
                    </label>
                    <input
                      type='text'
                      name='firstName'
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder='E.g. Joe'
                      className='w-full px-4 py-3 bg-gray-100 rounded-[2px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[14px]'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Last Name*
                    </label>
                    <input
                      type='text'
                      name='lastName'
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder='E.g. Smith'
                      className='w-full px-4 py-3 bg-gray-100 rounded-[2px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[14px]'
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Email ID*
                  </label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    placeholder='E.g. joesmith1234@gmail.com'
                    className='w-full px-4 py-3 bg-gray-100 rounded-[2px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[14px]'
                    required
                  />
                </div>

                {/* Phone Number Field */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Phone Number (optional)
                  </label>
                  <input
                    type='tel'
                    name='phone'
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder='E.g. (+91 99887-76655)'
                    className='w-full px-4 py-3 bg-gray-100 rounded-[2px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[14px]'
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Message
                  </label>
                  <textarea
                    name='message'
                    value={formData.message}
                    onChange={handleChange}
                    placeholder='Type your message here...'
                    rows='4'
                    className='w-full px-4 py-3 bg-gray-100 rounded-[2px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-[14px]'
                    required
                  />
                </div>
                <div className='border-b-1 border-black/50'></div>

                {/* Submit Button */}
                <button
                  type='button'
                  onClick={handleSubmit}
                  className='w-full bg-[#14397C] text-[#FFF2E0] py-3 px-6 rounded-[4px] font-medium hover:bg-blue-800 cursor-pointer transition-colors duration-200 flex items-center justify-center gap-2'
                >
                  Submit Message
                  <img
                    src='/assets/svgs/contact2.svg'
                    alt='Send Icon'
                    width={20}
                    height={20}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
