import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import liff from "@line/liff";
import { getLineUserId } from "../utils/storage";
import axios from "axios";
const WelcomePage = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLiffInitialized, setIsLiffInitialized] = useState(false);

//  ใช้  useEffect ในการใช้  liff
  useEffect(() => {
    const initializeLiff = async () => {
      try {
        await liff.init({ liffId: import.meta.env.VITE_LIFF_ID }); // ใช้ VITE_LIFF_ID จาก environment variables
        setIsLiffInitialized(true);
        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          setUserProfile(profile);
        } else {
          liff.login();
        }
      } catch (error) {
        console.error("Error initializing LIFF:", error);
      }
    };

    initializeLiff();
  }, []);

  const handleLogout = () => {
    if (isLiffInitialized) {
      liff.logout();
      navigate("/");
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const handleGoToProfilePage = async () => {
    
    try {
      const lineUserId = getLineUserId();
  
      if (!lineUserId) {
        alert("Line User ID is missing. Please log in again.");
        navigate("/");
        return;
      }
  
      // เรียก API เพื่อตรวจสอบสถานะ
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/export-status-user`, {
        params: { lineUserId },
      });
  
      const { status, isVerified } = response.data;
  
      console.log("User status:", { status, isVerified });
  
      // เปลี่ยนเส้นทางตามสถานะ
      if (!status) {
        navigate("/profilePage"); // กรณีไม่มีสถานะ (ไม่เคยกรอกข้อมูล)
      } else if (status === 1) {
        navigate("/pdpaPage"); // กรณีกรอกข้อมูลหลักแล้ว
      } else if (status === 2) {
        navigate("/twowayverify"); // กรณียืนยัน PDPA แล้ว
      } else if (status === 3 && isVerified) {
        navigate("/prvcard"); // กรณียืนยัน OTP แล้ว
      } else {
        alert("Invalid status or user not verified. Please contact support.");
      }
    } catch (error) {
      console.error("Error fetching user status:", error.response?.data || error.message);
      alert("Failed to fetch user status. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-300 to-green-100 relative">
      <div className="w-full max-w-xs sm:max-w-md lg:max-w-lg bg-white shadow-2xl rounded-xl p-6 border border-gray-200 relative">
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleDropdown}
            className="bg-gray-200 rounded-full p-2 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {userProfile?.pictureUrl && (
          <img
            src={userProfile.pictureUrl}
            alt="User Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
        )}
        <h1 className="text-center text-xl sm:text-2xl md:text-3xl font-bold mb-2">
          Welcome to Chee Chan Golf
        </h1>
        <p className="text-center text-gray-600 text-sm sm:text-base md:text-lg mb-6">
          Hello, {userProfile?.displayName}! Become our member to receive special privileges.
        </p>
        <button
          onClick={handleGoToProfilePage}
          className="bg-green-700 text-white py-2 px-4 rounded-full w-full hover:bg-green-600 transition-all duration-300"
        >
          Let`s go
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
