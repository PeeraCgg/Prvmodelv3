import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getLineUserId } from '../utils/storage';
const TwoWayVerify = () => {
    const navigate = useNavigate();

    const handleMobileVerify = () => {
      console.log("Mobile verification selected");
      // Add logic for mobile verification
    };
  
    const handleEmailVerify = async () => {
   try {
      const lineUserId = getLineUserId();

      if (!lineUserId) {
        alert('Line User ID is missing. Please log in again.');
        navigate('/');
        return;
      }

      console.log('Fetching email associated with lineUserId:', lineUserId);

      // เรียก API เพื่อส่ง OTP ไปยังอีเมลที่ผูกกับ lineUserId
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/requestotp-e`, {
        lineUserId,
       
      });

      if (response.data.message) {
        alert(response.data.message);
        navigate('/emailverify'); // ไปยังหน้าตรวจสอบ OTP
      }
    } catch (error) {
      if (error.response) {
        // ข้อผิดพลาดจาก Backend
        alert(error.response.data.error || 'Error occurred while verifying email.');
      } else {
        // ข้อผิดพลาดทั่วไป
        console.error('Unexpected error:', error);
        alert('Unexpected error occurred. Please try again later.');
      }
    }
    };
  
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Choose Verification Method</h1>
          <p className="text-gray-600 mb-8">
            Secure your account by verifying your identity through mobile or email.
          </p>
  
          <div className="space-y-4">
            {/* Verify Mobile Button */}
            <button
              onClick={handleMobileVerify}
              className="w-full py-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold shadow-md hover:from-green-500 hover:to-green-700 transition-all duration-300"
            >
              Verify Mobile
            </button>
  
            {/* Divider */}
            <div className="flex items-center justify-center my-4">
              <hr className="w-full border-t border-gray-300" />
              <span className="px-3 text-gray-500 text-sm">or</span>
              <hr className="w-full border-t border-gray-300" />
            </div>
  
            {/* Verify Email Button */}
            <button
              onClick={handleEmailVerify}
              className="w-full py-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold shadow-md hover:from-blue-500 hover:to-blue-700 transition-all duration-300"
            >
              Verify Email
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default TwoWayVerify;
  