import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import liff from "@line/liff";
import { getLineUserId } from "../utils/storage";
import axios from "axios";

const WelcomePage = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [isLiffInitialized, setIsLiffInitialized] = useState(false);

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        await liff.init({ liffId: import.meta.env.VITE_LIFF_ID });
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

  const handleGoToProfilePage = async () => {
    try {
      const lineUserId = getLineUserId();

      if (!lineUserId) {
        alert("Line User ID is missing. Please log in again.");
        navigate("/");
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/export-status-user`, {
        params: { lineUserId },
      });

      const { status, isVerified } = response.data;

      if (!status) {
        navigate("/profilePage");
      } else if (status === 1) {
        navigate("/pdpaPage");
      } else if (status === 2) {
        navigate("/twowayverify");
      } else if (status === 3 && isVerified) {
        navigate("/prvcard");
      } else {
        alert("Invalid status or user not verified. Please contact support.");
      }
    } catch (error) {
      console.error("Error fetching user status:", error.response?.data || error.message);
      alert("Failed to fetch user status. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#D3F1DF]">
      <div className="w-full max-w-xs sm:max-w-md lg:max-w-lg bg-gradient-to-r from-[#D3F1DF] to-white shadow-lg rounded-3xl p-8 border border-[#85A98F] relative">
        {/* Logout Button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={handleLogout}
            className="flex items-center px-3 py-2 bg-[#D3F1DF] rounded-full shadow-md hover:bg-[#85A98F] transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              width="20"
              fill="#525B44"
              className="mr-1"
              viewBox="0 0 24 24"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
            </svg>
          </button>
        </div>
        {/* Profile Picture */}
        {userProfile?.pictureUrl && (
          <img
            src={userProfile.pictureUrl}
            alt="User Profile"
            className="w-24 h-24 mx-auto mb-6 shadow-lg sm:w-28 sm:h-28 border-4 border-[#85A98F] rounded-full"
          />
        )}
        {/* Title */}
        <h1 className="text-center text-2xl sm:text-3xl font-semibold mb-4 text-[#5A6C57]">
          Welcome to Chee Chan Golf
        </h1>
        <p className="text-center text-[#525B44] text-sm sm:text-base mb-8">
          Hello, <span className="font-medium">{userProfile?.displayName}</span>! Join now to enjoy exclusive privileges.
        </p>
        {/* Button */}
        <button
          onClick={handleGoToProfilePage}
          className="bg-gradient-to-r from-[#85A98F] to-[#5A6C57] text-white py-2 sm:py-3 px-4 sm:px-6 rounded-full shadow-lg hover:from-[#5A6C57] hover:to-[#85A98F] transition-all duration-300 w-full text-sm sm:text-base font-medium"
        >
          Let’s Go
        </button>
      </div>
    </div>
  );
  
  
  
};

export default WelcomePage;
