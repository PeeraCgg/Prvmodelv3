import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

// ฟังก์ชันจัดการ localStorage
import { getLineUserId, removeLineUserId } from '../utils/storage';

const VerifyOtpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { token, phoneNumber } = location.state || {};

  const [otp, setOtp] = useState(['', '', '', '', '', '']); // ใช้ Array สำหรับ 6 ช่อง OTP
  const [isLoading, setIsLoading] = useState(false);

  const lineUserId = getLineUserId(); // ดึง lineUserId จาก localStorage

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'ArrowLeft' && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    } else if (e.key === 'ArrowRight' && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const otpCode = otp.join('').trim();

    if (!otpCode || otpCode.length !== 6) {
      Swal.fire({
        title: 'Error',
        text: 'OTP code is missing or incomplete.',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
      });
      setIsLoading(false);
      return;
    }

    if (!lineUserId) {
      Swal.fire({
        title: 'Error',
        text: 'Line User ID is missing. Please log in again.',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
      });
      removeLineUserId(); // ลบ Line User ID ออกจาก localStorage หากข้อมูลผิดพลาด
      navigate('/');
      setIsLoading(false);
      return;
    }

    try {
      // Step 1: Verify OTP
      await axios.post(`${import.meta.env.VITE_API_URL}/user/verify-otp`, {
        token,
        otp_code: otpCode,
      });

      // Step 2: Update user status using lineUserId from localStorage
      await axios.post(`${import.meta.env.VITE_API_URL}/user/update-status-after-otp`, {
        lineUserId,
      });

      Swal.fire({
        title: 'Success',
        text: 'OTP verified and status updated successfully!',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigate('/prvcard');
      });
    } catch (error) {
      console.error('Error verifying OTP or updating status:', error);

      Swal.fire({
        title: 'Error',
        text: error.response?.data?.error || 'OTP verification or status update failed. Please try again.',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#D3F1DF]">
      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md text-center border border-[#85A98F]">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#5A6C57] mb-4 sm:mb-6 tracking-wide">
          Verify OTP
        </h1>
        <p className="text-sm sm:text-base text-[#525B44] mb-6 sm:mb-8 leading-relaxed">
          An OTP has been sent to <span className="font-medium text-[#5A6C57]">{phoneNumber}</span>. Please enter it below.
        </p>
  
        <form onSubmit={handleVerifyOtp}>
          <div className="flex justify-between mb-4 sm:mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 sm:w-14 sm:h-14 text-center text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#85A98F] transition-all"
              />
            ))}
          </div>
  
          <button
            type="submit"
            className={`w-full py-2 sm:py-3 rounded-lg bg-gradient-to-r from-[#85A98F] to-[#5A6C57] text-white font-medium shadow-md hover:from-[#5A6C57] hover:to-[#85A98F] focus:ring-2 focus:ring-offset-2 focus:ring-[#85A98F] transition-all duration-300 ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Verify OTP'}
          </button>
        </form>
      </div>
    </div>
  );
  
};

export default VerifyOtpPage;
