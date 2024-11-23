import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getLineUserId } from "../utils/storage";

const ShowPdpa = () => {
  const navigate = useNavigate();
  const [pdpaData, setPdpaData] = useState({ checkbox1: false, checkbox2: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPDPA = async () => {
      const lineUserId = getLineUserId();

      if (!lineUserId) {
        alert("Line User ID is missing. Please log in again.");
        navigate("/");
        return;
      }

      try {
        // ส่ง lineUserId ผ่าน query string
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

  const handleDone = () => {
    navigate("/prvcard"); // Navigate to the prvcard page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">PDPA Agreement</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">
                <input
                  type="checkbox"
                  checked={pdpaData.checkbox1}
                  readOnly
                  className="mr-2"
                />
                I agree to the collection and use of my personal data.
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">
                <input
                  type="checkbox"
                  checked={pdpaData.checkbox2}
                  readOnly
                  className="mr-2"
                />
                I agree to receive marketing communications.
              </label>
            </div>
            <button
              onClick={handleDone}
              className="bg-green-500 text-white py-2 px-4 rounded-lg w-full hover:bg-green-600 transition-all"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowPdpa;
