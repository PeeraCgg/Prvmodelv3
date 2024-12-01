import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddProduct = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]); // Start with an empty list
  const [newProduct, setNewProduct] = useState({ productName: '', point: '' }); // Track input for new product

  // Handle input change for the new product
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Add new product to the list
  const handleAddToList = () => {
    if (!newProduct.productName || !newProduct.point) {
      Swal.fire('Error!', 'Please fill in both product name and points.', 'error');
      return;
    }

    setProducts((prev) => [...prev, { ...newProduct, point: parseInt(newProduct.point, 10) }]);
    setNewProduct({ productName: '', point: '' }); // Reset the form
  };

  // Handle adding all products
  const handleAddProduct = async () => {
    const confirmation = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to add these products?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, add it!',
    });

    if (confirmation.isConfirmed) {
      try {
        const response = await axios.post(
          'https://prvbackend.onrender.com/user/add-products', // Update with your endpoint
          { products }
        );

        Swal.fire('Added!', response.data.message, 'success');
        navigate('/all-product'); // Redirect to All Products page
      } catch (error) {
        console.error('Error adding products:', error);
        Swal.fire('Error!', 'Failed to add products. Please try again.', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Add Products</h1>

        {/* Input Fields */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Product Name</label>
          <input
            type="text"
            name="productName"
            value={newProduct.productName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Points</label>
          <input
            type="number"
            name="point"
            value={newProduct.point}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product points"
          />
        </div>
        <button
          onClick={handleAddToList}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full mb-6"
        >
          Add to List
        </button>

        {/* List of Products */}
        <ul className="mb-6">
          {products.map((product, index) => (
            <li key={index} className="mb-2 text-gray-700">
              {product.productName} - {product.point} points
            </li>
          ))}
        </ul>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => navigate('/all-product')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back to All Products
          </button>
          <button
            onClick={handleAddProduct}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={products.length === 0} // Disable if no products
          >
            Submit Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
