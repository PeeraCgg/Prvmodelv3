import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getLineUserId } from "../utils/storage.js";
const PdpaPage = () => {
  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    // ตรวจสอบว่า lineUserId มีอยู่ใน localStorage หรือไม่
    const lineUserId = getLineUserId();

    if (!lineUserId) {
      alert('Line User ID is missing. Please log in again.');
      navigate('/'); // กลับไปหน้า Login
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบว่าเงื่อนไขถูกเลือกทั้งสอง
    if (!checkbox1 || !checkbox2) {
      alert('Please check both conditions to proceed.');
      return;
    }
    try {
      const lineUserId = getLineUserId();

      if (!lineUserId) {
        alert('Line User ID is missing. Please log in again.');
        navigate('/');
        return;
      }
       // สร้างข้อมูลที่กำลังจะส่ง
    const dataToSend = {
      lineUserId,
      checkbox1,
      checkbox2,
    };

    // Log ข้อมูลที่กำลังจะส่งไปยัง Backend
    console.log('Data to be sent:', dataToSend);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/pdpa-access`, {
        lineUserId,
        checkbox1,
        checkbox2,
      });

      if (response.data.success) {
        alert(response.data.message);
        navigate('/twoWayVerify'); // ไปหน้าโปรไฟล์
      } else {
        alert(response.data.message || 'Failed to save consent.');
      }
    } catch (error) {
      console.error('Error saving consent:', error);
      alert('Failed to save consent. Please try again later.');
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Consent PDPA</h2>
        <p className="text-gray-600 mb-4">
          Please review and accept the conditions.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={checkbox1}
                onChange={() => setCheckbox1(!checkbox1)}
                className="form-checkbox text-green-500 h-5 w-5"
              />
              <span className="ml-2 text-gray-700">I agree to the first condition</span>
            </label>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={checkbox2}
                onChange={() => setCheckbox2(!checkbox2)}
                className="form-checkbox text-green-500 h-5 w-5"
              />
              <span className="ml-2 text-gray-700">I agree to the second condition</span>
            </label>
          </div>
          <div className="flex justify-between mt-6">
            <button
              type="button"
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded ${
                checkbox1 && checkbox2 ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'
              } text-white`}
              disabled={!checkbox1 || !checkbox2}
            >
              Done
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default  PdpaPage;
