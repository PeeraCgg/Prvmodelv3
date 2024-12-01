import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const AllProduct = () => {
  const [products, setProducts] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://prvbackend.onrender.com/user/get-all-product"); // Replace with your API URL
        console.log('Products fetched:', response.data); // Debug response
        setProducts(response.data.products || []); // Ensure products is always an array
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    fetchProducts();
  }, []);

  // Handle delete product
  const handleDelete = async (id) => {
    const confirmation = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirmation.isConfirmed) {
      try {
        await axios.delete(`https://prvbackend.onrender.com/user/delete-product/${id}`); // Replace with your delete endpoint
        setProducts((prev) => prev.filter((product) => product.id !== id)); // Remove the product from the UI
        Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting product:', error);
        Swal.fire('Error!', 'Failed to delete the product.', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <p>No products available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-center mb-6">All Products</h1>
      <div className="mb-4 flex justify-between">
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back to Dashboard
        </button>
        <button
          onClick={() => navigate('/add-product')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Product
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-4 border">#</th>
              <th className="p-4 border">Product Name</th>
              <th className="p-4 border">Points</th>
              <th className="p-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id} className="hover:bg-gray-100">
                <td className="p-4 border">{index + 1}</td>
                <td className="p-4 border">{product.productName}</td>
                <td className="p-4 border">{product.point}</td>
                <td className="p-4 border">
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllProduct;
