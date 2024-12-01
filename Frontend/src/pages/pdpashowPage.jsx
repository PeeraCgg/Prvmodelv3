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
    <div className="flex items-center justify-center min-h-screen bg-[#D3F1DF]">
      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg sm:text-xl font-semibold text-[#5A6C57]">
            {language === "EN" ? "PDPA Agreement" : "ข้อตกลง PDPA"}
          </h1>
          <div
            className={`w-16 h-8 flex items-center ${
              language === "EN" ? "bg-gray-300" : "bg-[#85A98F]"
            } rounded-full p-1 cursor-pointer`}
            onClick={toggleLanguage}
          >
            {/* Toggle Button */}
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
                language === "EN" ? "text-[#5A6C57]" : "text-gray-600"
              }`}
            >
              {language === "EN" ? "ENG" : ""}
            </span>
          </div>
        </div>
  
        {/* Content */}
        {loading ? (
          <p className="text-center text-gray-600">
            {language === "EN" ? "Loading..." : "กำลังโหลด..."}
          </p>
        ) : (
          <div>
            <div className="overflow-y-auto max-h-64 border border-gray-300 p-4 rounded-lg bg-[#F9F9F9] mb-6 shadow-inner">
              {language === "EN" ? (
                <p className="text-sm sm:text-base text-[#525B44] leading-relaxed">
                  **PDPA Agreement Content Here** Lorem ipsum dolor sit amet, consectetur adipiscing
                  elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                  minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                  commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                  proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              ) : (
                <p className="text-sm sm:text-base text-[#525B44] leading-relaxed">
                  **เนื้อหาข้อตกลง PDPA** Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                  veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                  consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                  sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              )}
            </div>
  
            {/* Checkbox */}
            <div className="mb-6">
              <label className="flex items-center space-x-2 text-[#5A6C57] font-medium text-sm sm:text-base">
                <input
                  type="checkbox"
                  checked={pdpaData.checkbox1}
                  readOnly
                  className="form-checkbox h-5 w-5 text-[#85A98F] focus:ring-0"
                />
                <span>
                  {language === "EN"
                    ? "I agree to the collection and use of my personal data."
                    : "ฉันยินยอมให้เก็บและใช้ข้อมูลส่วนตัวของฉัน"}
                </span>
              </label>
            </div>
  
            {/* Submit Button */}
            <button
              onClick={handleDone}
              className="bg-gradient-to-r from-[#85A98F] to-[#5A6C57] text-white py-2 sm:py-3 px-4 sm:px-6 w-full rounded-lg hover:from-[#5A6C57] hover:to-[#85A98F] transition-all duration-300 shadow-md text-sm sm:text-base font-medium"
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
