import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import liff from "@line/liff";
import axios from "axios";
import { getLineUserId } from "../utils/storage.js";

const EditProfilePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    mobile: "",
    birthday: "",
  });

  const [profileImage, setProfileImage] = useState(""); // เก็บ URL รูปโปรไฟล์
  const [errors, setErrors] = useState({}); // เก็บข้อความ error
  const [loading, setLoading] = useState(true);

  // ฟังก์ชันดึงข้อมูลจาก LIFF และ Backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await liff.init({ liffId: import.meta.env.VITE_LIFF_ID });

        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          setProfileImage(profile.pictureUrl); // ตั้งค่า URL รูปโปรไฟล์
        } else {
          liff.login();
        }

        const lineUserId = getLineUserId();
        if (!lineUserId) {
          alert("Line User ID is missing. Please log in again.");
          navigate("/");
          return;
        }

        // ดึงข้อมูลโปรไฟล์ผู้ใช้จาก Backend
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
        console.error("Error fetching user data or profile image:", error);
        alert("Error fetching user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // ฟังก์ชันตรวจสอบเบอร์โทรศัพท์
  const validateMobile = (value) => {
    if (!/^\d{1,10}$/.test(value)) {
      return "Mobile must be numeric and up to 10 digits.";
    }
    return "";
  };

  // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูลฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));

    if (name === "mobile") {
      setErrors((prevState) => ({ ...prevState, mobile: validateMobile(value) }));
    }
  };

  // ฟังก์ชันจัดการการบันทึกข้อมูล
  const handleSubmit = async (e) => {
    e.preventDefault();

    const mobileError = validateMobile(formData.mobile);
    if (mobileError) {
      setErrors((prevState) => ({ ...prevState, mobile: mobileError }));
      alert("Please fix the errors before submitting.");
      return;
    }

    try {
      const lineUserId = getLineUserId();
      if (!lineUserId) {
        alert("Line User ID is missing. Please log in again.");
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

      alert("Profile updated successfully!");
      navigate("/prvcard");
    } catch (error) {
      console.error("Error saving user data:", error);
      alert("Failed to update profile!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Edit Profile</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* รูปโปรไฟล์ */}
            {profileImage && (
              <div className="flex justify-center mb-6">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full shadow-md"
                />
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-gray-700">Full Name</label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              {errors.fullname && <p className="text-red-500 text-sm">{errors.fullname}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-gray-700">Mobile</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled
              />
              {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
            </div>

            {/* Birthday */}
            <div>
              <label className="block text-gray-700">Birthday</label>
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded-lg w-full hover:bg-green-600 transition-all"
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
