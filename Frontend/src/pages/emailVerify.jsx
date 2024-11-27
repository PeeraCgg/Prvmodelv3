import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getLineUserId } from '../utils/storage';
import Swal from 'sweetalert2';

function EmailVerifyOtp() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [message, setMessage] = useState('');
  const [errorMessage] = useState('');
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(0);

  const lineUserId = getLineUserId();

  useEffect(() => {
    if (!lineUserId) {
      Swal.fire({
        title: 'Error',
        text: 'Line User ID is missing. Please log in again.',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigate('/');
      });
    }
  }, [lineUserId, navigate]);

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
    const otpCode = otp.join('').trim();

    if (!lineUserId || otpCode.length !== 6) {
      Swal.fire({
        title: 'Error',
        text: 'OTP code is missing or incomplete.',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/verifyotp-e`, {
        lineUserId,
        otpCode,
      });

      if (response.status === 200) {
        Swal.fire({
          title: 'Success',
          text: 'OTP verified successfully!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate('/prvcard');
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.error || 'Network error. Please try again later.',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const handleSendCodeAgain = async () => {
    if (!lineUserId) {
      Swal.fire({
        title: 'Error',
        text: 'Line User ID is missing. Please log in again.',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
  
    try {
      console.log('Requesting new OTP for:', lineUserId);
  
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/requestotp-e`, {
        lineUserId,
      });
  
      if (response.status === 200) {
        setMessage('A new OTP has been sent to your email.');
        setCountdown(60); // ตั้งเวลานับถอยหลัง 60 วินาที
      } else {
        setMessage('Failed to send OTP. Please try again later.');
      }
    } catch (error) { // Corrected here
      console.error('Error requesting OTP:', error.response?.data || error.message);
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.error || 'Network error. Please try again later.',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };
  

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [countdown]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-200 via-green-300 to-green-100">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4 tracking-wide">
          Confirm your code
        </h1>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Enter the 6-digit code we sent to your email.
        </p>

        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

        <form onSubmit={handleVerifyOtp} className="flex flex-col items-center">
          <div className="flex space-x-2 mb-6">
            {otp.map((value, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={value}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 border border-gray-300 rounded-lg text-center text-xl font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            ))}
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-full shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-300 w-full max-w-xs"
            disabled={otp.join('').length < 6}
          >
            Confirm
          </button>
        </form>

        {message && <p className="mt-4 text-green-500">{message}</p>}
        <button
          type="button"
          className="mt-4 text-green-600 font-medium hover:underline"
          onClick={handleSendCodeAgain}
          disabled={countdown > 0}
        >
          {countdown > 0 ? `Send code again in ${countdown}s` : 'Send code again'}
        </button>
      </div>
    </div>
  );
}

export default EmailVerifyOtp;
