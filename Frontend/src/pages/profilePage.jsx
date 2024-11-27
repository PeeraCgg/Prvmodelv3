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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-400 via-green-300 to-green-200">
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">Profile Page</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg text-lg bg-gray-50 focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg text-lg bg-gray-50 focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mobile</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              onKeyDown={handleMobileKeyDown}
              maxLength="10"
              className="w-full px-4 py-3 border rounded-lg text-lg bg-gray-50 focus:ring-2 focus:ring-green-500"
              required
            />
            {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Birthday</label>
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg text-lg bg-gray-50 focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg text-lg bg-gray-50 focus:ring-2 focus:ring-green-500"
              required
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-green-500 to-green-400 text-white py-3 px-6 rounded-lg text-lg shadow hover:from-green-400 hover:to-green-300 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
