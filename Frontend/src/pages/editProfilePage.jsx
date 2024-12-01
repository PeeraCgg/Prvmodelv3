import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import liff from "@line/liff";
import axios from "axios";
import { getLineUserId } from "../utils/storage.js";
import Swal from "sweetalert2";

const EditProfilePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    mobile: "",
    birthday: "",
  });

  const [profileImage, setProfileImage] = useState(""); // Store profile image URL
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await liff.init({ liffId: import.meta.env.VITE_LIFF_ID });

        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          setProfileImage(profile.pictureUrl); // Set profile image URL
        } else {
          liff.login();
        }

        const lineUserId = getLineUserId();
        if (!lineUserId) {
          Swal.fire({
            title: "Error",
            text: "Line User ID is missing. Please log in again.",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
          navigate("/");
          return;
        }

        const userResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/get-edit-user`,
          { params: { lineUserId } }
        );

        const { fullname, email, mobile, birthday } = userResponse.data;
        setFormData({
          fullname: fullname || "",
          email: email || "",
          mobile: mobile || "",
          birthday: birthday ? birthday.split("T")[0] : "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to fetch user data.",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const lineUserId = getLineUserId();
      if (!lineUserId) {
        Swal.fire({
          title: "Error",
          text: "Line User ID is missing. Please log in again.",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/");
        return;
      }

      await axios.post(
        `${import.meta.env.VITE_API_URL}/user/save-edit-user`,
        {
          fullname: formData.fullname,
          birthday: formData.birthday,
        },
        { params: { lineUserId } }
      );

      Swal.fire({
        title: "Profile Updated!",
        text: "Your profile has been saved successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigate("/prvcard");
      });
    } catch (error) {
      console.error("Error saving user data:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to update profile!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#D3F1DF]">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-sm sm:max-w-md">
        <h1 className="text-xl sm:text-2xl font-semibold text-center text-[#5A6C57] mb-6">
          Edit Profile
        </h1>
  
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image */}
            {profileImage && (
              <div className="flex justify-center mb-6">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full shadow-md border-4 border-[#85A98F]"
                />
              </div>
            )}
  
            {/* Full Name */}
            <div>
              <label className="block text-sm sm:text-base text-[#525B44] font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#85A98F]"
                required
              />
            </div>
  
            {/* Email */}
            <div>
              <label className="block text-sm sm:text-base text-[#525B44] font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#85A98F]"
                disabled
              />
            </div>
  
            {/* Mobile */}
            <div>
              <label className="block text-sm sm:text-base text-[#525B44] font-medium mb-2">
                Mobile
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#85A98F]"
                disabled
              />
            </div>
  
            {/* Birthday */}
            <div>
              <label className="block text-sm sm:text-base text-[#525B44] font-medium mb-2">
                Birthday
              </label>
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#85A98F]"
                required
              />
            </div>
  
            {/* Save Button */}
            <button
              type="submit"
              className="bg-gradient-to-r from-[#85A98F] to-[#5A6C57] text-white py-2 sm:py-3 px-4 rounded-lg shadow-md hover:from-[#5A6C57] hover:to-[#85A98F] transition-all w-full text-sm sm:text-lg font-medium"
            >
              Save
            </button>
          </form>
        )}
      </div>
    </div>
  );
  
};

export default EditProfilePage;
