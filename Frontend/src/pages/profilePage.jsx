import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { getLineUserId } from "../utils/storage.js";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    mobile: "",
    birthday: "",
    email: "",
  });
  const [errors, setErrors] = useState({
    mobile: "",
    email: "",
  });

  useEffect(() => {
    const checkLineUserId = async () => {
      try {
        const lineUserId = getLineUserId();
        if (!lineUserId) {
          alert("User not logged in via LINE.");
          navigate("/");
          return;
        }

        const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/get-user`, {
          lineUserId,
        });

        if (response.data.isNewUser) {
          alert("ผู้ใช้ใหม่ กรุณากรอกข้อมูล");
        } else if (response.data.user) {
          const user = response.data.user;
          setFormData({
            firstname: user.firstname || "",
            lastname: user.lastname || "",
            mobile: user.mobile || "",
            birthday: user.birthday ? user.birthday.split("T")[0] : "",
            email: user.email || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Error fetching user data.");
      }
    };

    checkLineUserId();
  }, [navigate]);

  const validateMobile = (value) => {
    if (!/^\d{1,10}$/.test(value)) {
      return "Mobile must be numeric and up to 10 digits.";
    }
    return "";
  };

  const validateEmail = (value) => {
    if (!/^[\w.-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,4}$/.test(value)) {
      return "Invalid email format.";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "mobile") {
      setErrors((prevState) => ({
        ...prevState,
        mobile: validateMobile(value),
      }));
    }
    if (name === "email") {
      setErrors((prevState) => ({
        ...prevState,
        email: validateEmail(value),
      }));
    }
  };

  const handleMobileKeyDown = (e) => {
    // อนุญาตเฉพาะปุ่มตัวเลขและปุ่มควบคุม เช่น Backspace
    if (
      !(
        (e.key >= "0" && e.key <= "9") || // ตัวเลข
        e.key === "Backspace" || // ลบ
        e.key === "ArrowLeft" || // ลูกศรซ้าย
        e.key === "ArrowRight" || // ลูกศรขวา
        e.key === "Tab" // ปุ่ม Tab
      )
    ) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mobileError = validateMobile(formData.mobile);
    const emailError = validateEmail(formData.email);

    if (mobileError || emailError) {
      setErrors({
        mobile: mobileError,
        email: emailError,
      });
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

      const dataToSend = {
        ...formData,
        lineUserId,
      };

      console.log("Data to be sent:", dataToSend);

      await axios.post(`${import.meta.env.VITE_API_URL}/user/add-or-update`, dataToSend);
      alert("Data saved successfully!");
      navigate("/pdpaPage");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save data!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome to the Profile Page!</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">First Name</label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Mobile</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              onKeyDown={handleMobileKeyDown} // ใช้ onKeyDown ป้องกันการกรอกที่ไม่ใช่ตัวเลข
              maxLength="10" // จำกัดความยาว
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
          </div>

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

          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded-lg w-full hover:bg-green-600 transition-all"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
