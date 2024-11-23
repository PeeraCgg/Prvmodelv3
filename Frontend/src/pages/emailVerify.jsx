import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getLineUserId } from '../utils/storage'; // ฟังก์ชันดึง lineUserId จาก Local Storage

function EmailVerifyOtp() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(0);

  // ดึง lineUserId จาก Local Storage
  const lineUserId = getLineUserId();

  useEffect(() => {
    if (!lineUserId) {
      // ถ้าไม่มี lineUserId ให้กลับไปที่หน้า WelcomePage
      setErrorMessage('Line User ID is missing. Please log in again.');
      navigate('/');
    }
  }, [lineUserId, navigate]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus(); // ไปที่ช่องถัดไป
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
    const otpCode = otp.join('').trim(); // รวมค่า OTP เป็น string
  
    if (!lineUserId || otpCode.length !== 6) {
      setErrorMessage('Line User ID or OTP code is missing or incomplete.');
      return;
    }
  
    try {
      console.log('Verifying OTP with:', { lineUserId, otpCode });
  
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/verifyotp-e`, {
        lineUserId,
        otpCode,
      });
  
      if (response.status === 200) {
        alert('OTP verified successfully!');
        navigate('/prvcard');
      } else {
        setMessage('OTP verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error.response?.data || error.message);
      setErrorMessage(error.response?.data?.error || 'Network error. Please try again later.');
    }
  };
  

  const handleSendCodeAgain = async () => {
    if (!lineUserId) {
      setErrorMessage('Line User ID is missing. Please log in again.');
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
    } catch (error) {
      console.error('Error requesting OTP:', error.response?.data || error.message);
      setErrorMessage(error.response?.data?.error || 'Network error. Please try again later.');
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWALG5llGqOBpVrtqnUc7_rlmEBJ-_BaDsow&s"
          alt="Logo"
          className="mb-6 mx-auto"
          style={{ width: '80px', height: '80px' }}
        />
        <h1 className="text-2xl font-bold mb-4">Confirm your code</h1>
        <p className="text-gray-600 mb-6">Enter the code we sent to your email</p>

        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

        <form onSubmit={handleVerifyOtp} className="flex flex-col items-center">
          <div className="flex space-x-2 mb-4">
            {otp.map((value, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={value}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="border rounded w-12 h-12 text-center text-lg"
                required
              />
            ))}
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white py-2 rounded w-full max-w-xs"
            disabled={otp.join('').length < 6}
          >
            Confirm
          </button>
        </form>

        {message && <p className="mt-4 text-green-500">{message}</p>}
        <button
          type="button"
          className="mt-4 text-blue-500"
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
