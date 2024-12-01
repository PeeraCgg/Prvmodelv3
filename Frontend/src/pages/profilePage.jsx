import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
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
          Swal.fire({
            title: "Error",
            text: "User not logged in via LINE.",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
          navigate("/");
          return;
        }

        const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/get-user`, {
          lineUserId,
        });

        if (response.data.isNewUser) {
          Swal.fire({
            title: "Welcome",
            text: "ผู้ใช้ใหม่ กรุณากรอกข้อมูล",
            icon: "info",
            timer: 2000,
            showConfirmButton: false,
          });
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
        Swal.fire({
          title: "Error",
          text: "Error fetching user data.",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
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
    if (
      !(
        (e.key >= "0" && e.key <= "9") || 
        e.key === "Backspace" || 
        e.key === "ArrowLeft" || 
        e.key === "ArrowRight" || 
        e.key === "Tab"
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
      Swal.fire({
        title: "Validation Error",
        text: "Please fix the errors before submitting.",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

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

      const dataToSend = {
        ...formData,
        lineUserId,
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/user/add-or-update`, dataToSend);

      Swal.fire({
        title: "Success",
        text: "Data saved successfully!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigate("/pdpaPage");
      });
    } catch (error) {
      console.error("Error saving data:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to save data!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#D3F1DF]">
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md w-full max-w-md sm:max-w-lg border border-[#85A98F]">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-center text-[#5A6C57]">
          Profile Page
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-[#525B44] mb-2">First Name</label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="w-full px-3 py-2 sm:py-3 border rounded-lg text-base sm:text-lg bg-gray-50 focus:ring-2 focus:ring-[#85A98F] focus:outline-none"
              required
            />
          </div>
  
          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-[#525B44] mb-2">Last Name</label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="w-full px-3 py-2 sm:py-3 border rounded-lg text-base sm:text-lg bg-gray-50 focus:ring-2 focus:ring-[#85A98F] focus:outline-none"
              required
            />
          </div>
  
          {/* Mobile */}
          <div>
            <label className="block text-sm font-medium text-[#525B44] mb-2">Mobile</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              onKeyDown={handleMobileKeyDown}
              maxLength="10"
              className="w-full px-3 py-2 sm:py-3 border rounded-lg text-base sm:text-lg bg-gray-50 focus:ring-2 focus:ring-[#85A98F] focus:outline-none"
              required
            />
            {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
          </div>
  
          {/* Birthday */}
          <div>
            <label className="block text-sm font-medium text-[#525B44] mb-2">Birthday</label>
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              className="w-full px-3 py-2 sm:py-3 border rounded-lg text-base sm:text-lg bg-gray-50 focus:ring-2 focus:ring-[#85A98F] focus:outline-none"
              required
            />
          </div>
  
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#525B44] mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 sm:py-3 border rounded-lg text-base sm:text-lg bg-gray-50 focus:ring-2 focus:ring-[#85A98F] focus:outline-none"
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
  
          {/* Submit Button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-[#85A98F] to-[#5A6C57] text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg text-base sm:text-lg shadow-md hover:from-[#5A6C57] hover:to-[#85A98F] transition-all duration-300 w-full focus:ring-2 focus:ring-offset-2 focus:ring-[#85A98F]"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
  
  
};

export default ProfilePage;
