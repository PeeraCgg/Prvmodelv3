import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ใช้ useNavigate จาก React Router
import liff from '@line/liff';
import axios from 'axios';
import { saveLineUserId } from '../utils/storage.js';
const LoginWithLine = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // ใช้ navigate สำหรับการเปลี่ยนหน้า

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        // Initialize LIFF
        await liff.init({ liffId: import.meta.env.VITE_LIFF_ID }); // Replace with your LIFF ID
        if (!liff.isLoggedIn()) {
          liff.login(); // Redirect to LINE Login
        } else {
            // ดึง LINE User ID จาก ID Token
          const idToken = liff.getDecodedIDToken();
          const lineUserId = idToken.sub;

          console.log("LINE User ID:", lineUserId);
           // เก็บ LINE User ID ลงใน localStorage
           saveLineUserId(lineUserId);
        
          // ส่ง LINE User ID ไปยัง Backend
          await axios.post(`${import.meta.env.VITE_API_URL}/user/login-line`, {
            lineUserId,
          });


          // หลังจากล็อกอินสำเร็จ navigate ไปยังหน้า WelcomePage
          navigate('/welcomepage');
        }
      } catch (error) {
        console.error('LIFF Initialization failed', error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    initializeLiff();
  }, [navigate]); // เพิ่ม navigate เป็น dependency

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-sm text-center">
        <div className="mb-4">
          <img
            src="https://cheechangolf.com/wp-content/uploads/2019/10/Chee-Chan-Golf-Resort_LOGO_RGB.png"
            alt="CCGR"
            className="mx-auto w-32 h-auto"
          />
        </div>
        <h1 className="text-xl font-bold text-green-600 mb-2">CCGR</h1>
        <p className="text-gray-500 text-sm mb-6">GOLF</p>
        {isLoading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <button
            className="flex items-center justify-center bg-green-500 text-white py-2 px-4 rounded-lg w-full hover:bg-green-600 transition-all"
            onClick={() => liff.login()}
          >
            <img
              src="/line-icon.png"
              alt="LINE Icon"
              className="w-5 h-5 mr-2"
            />
            Sign in with Line
          </button>
        )}
      </div>
    </div>
  );
};

export default LoginWithLine;
