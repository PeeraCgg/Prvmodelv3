import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import axios from "axios";

const PurchaseLicense = () => {
  const { id } = useParams(); // ดึง userId จาก URL
  const navigate = useNavigate(); // สำหรับเปลี่ยนเส้นทาง
  const [message, setMessage] = useState(""); // ข้อความแสดงสถานะ
  const [error, setError] = useState(""); // ข้อความแสดงข้อผิดพลาด

  const handlePurchase = async () => {
    try {
      // เรียก API เพื่อซื้อ License
      const response = await axios.post("https://prvbackend.onrender.com/user/purchase-license", {
        userId: id,
      });
      setMessage(response.data.message); // ตั้งค่าข้อความสำเร็จ
      setError(""); // ล้างข้อความข้อผิดพลาด

      // เปลี่ยนเส้นทางกลับไปยัง /userinformation หลังจากสำเร็จ
      setTimeout(() => {
        navigate("/userinformation");
      }, 2000); // รอ 2 วินาทีเพื่อให้ผู้ใช้เห็นข้อความสำเร็จ
    } catch (err) {
      // ตั้งค่าข้อความข้อผิดพลาด
      setError(err.response?.data?.error || "เกิดข้อผิดพลาดในการเชื่อมต่อ");
      setMessage(""); // ล้างข้อความสำเร็จ

      // ถ้าผู้ใช้มีบัตรอยู่แล้ว ให้เปลี่ยนเส้นทางไปที่ /userinformation
      if (err.response?.status === 400) {
        setTimeout(() => {
          navigate("/userinformation");
        }, 2000); 
      }
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Purchase License</h1>
        <p>User ID: {id}</p>

        {/* ปุ่มซื้อ License */}
        <button
          onClick={handlePurchase}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
        >
          Purchase License
        </button>

        {/* แสดงข้อความสถานะ */}
        {message && <p className="text-green-500 mt-4">{message}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default PurchaseLicense;
