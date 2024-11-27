import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { getLineUserId } from '../utils/storage';

const TwoWayVerify = () => {
  const navigate = useNavigate();

  const handleMobileVerify = () => {
    Swal.fire({
      title: 'Mobile Verification',
      text: 'Mobile verification is not yet implemented.',
      icon: 'info',
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleEmailVerify = async () => {
    try {
      const lineUserId = getLineUserId();

      if (!lineUserId) {
        Swal.fire({
          title: 'Error',
          text: 'Line User ID is missing. Please log in again.',
          icon: 'error',
          timer: 2000,
          showConfirmButton: false,
        });
        navigate('/');
        return;
      }

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/requestotp-e`, {
        lineUserId,
      });

      if (response.data.message) {
        Swal.fire({
          title: 'Success',
          text: response.data.message,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate('/emailverify');
        });
      }
    } catch (error) {
      if (error.response) {
        Swal.fire({
          title: 'Error',
          text: error.response.data.error || 'Error occurred while verifying email.',
          icon: 'error',
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        console.error('Unexpected error:', error);
        Swal.fire({
          title: 'Error',
          text: 'Unexpected error occurred. Please try again later.',
          icon: 'error',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-200 via-green-300 to-green-100">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 tracking-wide">
          Choose Verification Method
        </h1>
        <p className="text-gray-600 text-base mb-8 leading-relaxed">
          Secure your account by verifying your identity through mobile or email.
        </p>

        <div className="space-y-6">
          {/* Verify Mobile Button */}
          <button
            onClick={handleMobileVerify}
            className="w-full py-3 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white font-medium shadow-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-green-400 transition-all duration-300"
          >
            Verify Mobile
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full h-0.5 bg-gray-300"></div>
            <span className="absolute px-3 bg-white text-gray-500 text-sm">or</span>
          </div>

          {/* Verify Email Button */}
          <button
            onClick={handleEmailVerify}
            className="w-full py-3 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white font-medium shadow-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-green-400 transition-all duration-300"
          >
            Verify Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwoWayVerify;
