import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { getLineUserId } from '../utils/storage';

const TwoWayVerify = () => {
  const navigate = useNavigate();

  const handleMobileVerify = async () => {
    try {
      // Step 1: Verify Line User ID
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

      const verifyResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/verify-line-user`,
        { line_user_id: lineUserId }
      );

      const phoneNumber = verifyResponse.data.phone_number;

      console.log('Phone number retrieved:', phoneNumber);

      // Step 2: Request OTP
      const otpResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/request-otp`,
        { phone_number: phoneNumber }
      );

      const token = otpResponse.data.token;

      console.log('OTP sent successfully:', token);

      // ส่ง token และ phoneNumber ไปยังหน้า Verify OTP
      navigate('/checkOtp', { state: { token, phoneNumber } });
    } catch (error) {
      console.error('Error during request process:', error);

      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'Something went wrong. Please try again.',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
      });
    }
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
    <div className="flex items-center justify-center min-h-screen bg-[#D3F1DF]">
      <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md border border-[#85A98F]">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#5A6C57] mb-4 sm:mb-6 text-center">
          Choose Verification Method
        </h1>
        <p className="text-sm sm:text-base text-[#525B44] mb-6 sm:mb-8 text-center leading-relaxed">
          Secure your account by verifying your identity through mobile or email.
        </p>

        <div className="space-y-4 sm:space-y-6">
          {/* Verify Mobile Button */}
          <button
            onClick={handleMobileVerify}
            className="w-full py-2 sm:py-3 rounded-lg bg-gradient-to-r from-[#85A98F] to-[#5A6C57] text-white font-medium shadow-md hover:from-[#5A6C57] hover:to-[#85A98F] transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-[#85A98F]"
          >
            Verify Mobile
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full h-[1px] bg-gray-300"></div>
            <span className="absolute px-3 bg-white text-[#525B44] text-sm sm:text-base">or</span>
          </div>

          {/* Verify Email Button */}
          <button
            onClick={handleEmailVerify}
            className="w-full py-2 sm:py-3 rounded-lg bg-gradient-to-r from-[#85A98F] to-[#5A6C57] text-white font-medium shadow-md hover:from-[#5A6C57] hover:to-[#85A98F] transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-[#85A98F]"
          >
            Verify Email
          </button>
        </div>
      </div>
    </div>
  );
};


export default TwoWayVerify;
