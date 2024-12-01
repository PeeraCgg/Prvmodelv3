import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AllRewardsPage = () => {
  const [rewards, setRewards] = useState([]);
  const [filteredRewards, setFilteredRewards] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllRewards = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/get-all-reward`);
        if (response.data.success) {
          setRewards(response.data.products);
          setFilteredRewards(response.data.products);
        } else {
          setError(response.data.message || "No rewards available.");
        }
      } catch (err) {
        console.error("Error fetching rewards:", err);
        setError("Failed to fetch rewards. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllRewards();
  }, []);

  // Function to handle search input changes
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query) {
      const filtered = rewards.filter((reward) =>
        reward.productName.toLowerCase().includes(query)
      );
      setFilteredRewards(filtered);
    } else {
      setFilteredRewards(rewards);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#D3F1DF]">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-sm sm:max-w-md">
        <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center text-[#5A6C57]">
          All Rewards
        </h1>
  
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search for rewards..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#85A98F]"
              />
            </div>
  
            {/* Rewards List */}
            <div className="space-y-4">
              {filteredRewards.length > 0 ? (
                filteredRewards.map((reward) => (
                  <div
                    key={reward.id}
                    className="flex justify-between items-center p-4 border rounded-lg shadow-sm bg-[#F9F9F9] hover:bg-[#F5F5F5] transition-all"
                  >
                    <div>
                      <p className="text-sm sm:text-base font-medium text-[#5A6C57]">
                        {reward.productName}
                      </p>
                      <p className="text-xs sm:text-sm text-[#525B44]">
                        Points: {reward.point}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No rewards match your search.
                </p>
              )}
            </div>
          </>
        )}
  
        {/* Back Button */}
        <button
          onClick={() => navigate("/prvcard")}
          className="mt-6 bg-gradient-to-r from-[#85A98F] to-[#5A6C57] text-white py-2 sm:py-3 px-4 rounded-full shadow-md hover:from-[#5A6C57] hover:to-[#85A98F] transition-all duration-300 w-full text-sm sm:text-base font-medium"
        >
          Back to PRV Card
        </button>
      </div>
    </div>
  );
  
};

export default AllRewardsPage;
