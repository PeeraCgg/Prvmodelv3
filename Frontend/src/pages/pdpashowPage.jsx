import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getLineUserId } from "../utils/storage";

const ShowPdpa = () => {
  const navigate = useNavigate();
  const [pdpaData, setPdpaData] = useState({ checkbox1: false });
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("EN");

  useEffect(() => {
    const fetchPDPA = async () => {
      const lineUserId = getLineUserId();

      if (!lineUserId) {
        alert("Line User ID is missing. Please log in again.");
        navigate("/");
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/pdpa-show`, {
          params: { lineUserId },
        });

        if (response.data.success) {
          setPdpaData(response.data.pdpa);
        } else {
          alert(response.data.message || "Failed to fetch PDPA data.");
        }
      } catch (error) {
        console.error("Error fetching PDPA data:", error);
        alert("Failed to fetch PDPA data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPDPA();
  }, [navigate]);

  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === "EN" ? "TH" : "EN"));
  };

  const handleDone = () => {
    navigate("/prvcard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-300 via-green-100 to-green-50">
      <div className="bg-white p-6 rounded-3xl shadow-md w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-gray-800">
            {language === "EN" ? "PDPA Agreement" : "ข้อตกลง PDPA"}
          </h1>
          <div
            className={`w-16 h-8 flex items-center ${
              language === "EN" ? "bg-gray-300" : "bg-green-500"
            } rounded-full p-1 cursor-pointer`}
            onClick={toggleLanguage}
          >
            <div
              className={`h-6 w-6 rounded-full shadow-md transform transition-transform ${
                language === "EN" ? "translate-x-0 bg-white" : "translate-x-8 bg-white"
              }`}
            />
            <span
              className={`absolute text-xs top-1.5 left-2 ${
                language === "EN" ? "text-gray-600" : "text-green-900"
              }`}
            >
              {language === "TH" ? "TH" : ""}
            </span>
            <span
              className={`absolute text-xs top-1.5 right-2 ${
                language === "EN" ? "text-green-900" : "text-gray-600"
              }`}
            >
              {language === "EN" ? "ENG" : ""}
            </span>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">
            {language === "EN" ? "Loading..." : "กำลังโหลด..."}
          </p>
        ) : (
          <div>
            <div className="overflow-y-scroll max-h-80 border border-gray-300 p-4 rounded-lg bg-gray-50 mb-4">
              {language === "EN" ? (
                <p>
                  **PDPA Agreement Content Here** Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
                  ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                  voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                  occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
                  id est laborum.
                </p>
              ) : (
                <p>
                  **เนื้อหาข้อตกลง PDPA** Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                  minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                  commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                  proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              )}
            </div>
            <div className="mb-6">
              <label className="flex items-center space-x-2 text-gray-700 font-medium">
                <input
                  type="checkbox"
                  checked={pdpaData.checkbox1}
                  readOnly
                  className="form-checkbox h-5 w-5 text-green-500 focus:ring-0"
                />
                <span>
                  {language === "EN"
                    ? "I agree to the collection and use of my personal data."
                    : "ฉันยินยอมให้เก็บและใช้ข้อมูลส่วนตัวของฉัน"}
                </span>
              </label>
            </div>
            <button
              onClick={handleDone}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 w-full rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md text-lg font-medium"
            >
              {language === "EN" ? "Done" : "เสร็จสิ้น"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowPdpa;
