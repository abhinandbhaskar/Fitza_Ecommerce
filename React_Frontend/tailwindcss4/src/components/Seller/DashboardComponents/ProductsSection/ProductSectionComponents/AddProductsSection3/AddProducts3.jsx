import React from 'react';

const AddProducts3 = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Dashboard &gt; <span className="text-indigo-600">Add Product Images</span>
        </h1>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Main Image Section */}
        <section className="bg-white p-6 shadow-sm rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Add Main Image</h2>
          <div className="flex flex-col items-start gap-2">
            <label
              htmlFor="main-image"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-indigo-700"
            >
              Upload Main Image
            </label>
            <input id="main-image" type="file" className="hidden" />
            <p className="text-sm text-gray-500">Main image is the primary display image for the product.</p>
          </div>
        </section>

        {/* Sub Images Section */}
        <section className="bg-white p-6 shadow-sm rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Add Sub Images (Up to 3)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((index) => (
              <div key={index} className="flex flex-col items-start gap-2">
                <label
                  htmlFor={`sub-image-${index}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700"
                >
                  Upload Image {index}
                </label>
                <input id={`sub-image-${index}`} type="file" className="hidden" />
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Sub images provide additional views of the product. Ensure high-quality images are uploaded.
          </p>
        </section>

        {/* Submit Button */}
        <div className="text-right">
          <button
            className="bg-green-600 text-white px-6 py-2 rounded-md text-lg font-medium hover:bg-green-700 shadow-md"
          >
            Submit Product
          </button>
        </div>
      </main>
    </div>
  );
};

export default AddProducts3;