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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">All Rewards</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <>
            {/* Search Bar */}
            <div className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search for rewards..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              {filteredRewards.length > 0 ? (
                filteredRewards.map((reward) => (
                  <div
                    key={reward.id}
                    className="flex justify-between items-center p-4 mb-4 border rounded-lg shadow-sm"
                  >
                    <div>
                      <p className="text-lg font-semibold">{reward.productName}</p>
                      <p className="text-sm text-gray-600">Points: {reward.point}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-center">No rewards match your search.</p>
              )}
            </div>
          </>
        )}
        {/* Back Button */}
        <button
          onClick={() => navigate("/prvcard")}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg w-full hover:bg-blue-600 transition-all"
        >
          Back to PRV Card
        </button>
      </div>
    </div>
  );
};

export default AllRewardsPage;
