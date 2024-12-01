import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserInformation = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Search input
  const [dropdownVisible, setDropdownVisible] = useState(null); // Manage dropdown visibility
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from the backend
    const fetchData = async () => {
      try {
        const response = await axios.get("https://prvbackend.onrender.com/user/get-all-user");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, []);

  // Toggle dropdown menu
  const toggleDropdown = (userId) => {
    setDropdownVisible((prev) => (prev === userId ? null : userId));
  };

// Filter users by search term
const filteredUsers = users.filter((user) => {
  const firstName = user.firstname?.toLowerCase() || '';
  const lastName = user.lastname?.toLowerCase() || '';
  const email = user.email?.toLowerCase() || '';
  const mobile = user.mobile || '';

  return (
    firstName.includes(searchTerm.toLowerCase()) ||
    lastName.includes(searchTerm.toLowerCase()) ||
    mobile.includes(searchTerm) ||
    email.includes(searchTerm.toLowerCase())
  );
});

  // Format date to y/m/d
  const formatDate = (date) => {
    return date ? new Date(date).toISOString().split("T")[0] : "N/A";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-purple-600 flex items-center justify-center">
      {/* White Container */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">User Information</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-md"
          >
            Dashboard
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, mobile, or email"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* User Table */}
        <div className="overflow-visible">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-6 py-4">Full Name</th>
                <th className="px-6 py-4">Mobile</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Privilege Expire Date</th>
                <th className="px-6 py-4">License ID</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100 transition relative">
                  <td className="px-6 py-4">{user.firstname} {user.lastname}</td>
                  <td className="px-6 py-4">{user.mobile}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    {user.privileges[0]?.prvExpiredDate
                      ? formatDate(user.privileges[0].prvExpiredDate)
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {user.privileges[0]?.prvLicenseId || "N/A"}
                  </td>
                  <td className="px-6 py-4 relative">
                    <button
                      onClick={() => toggleDropdown(user.id)}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full hover:from-blue-600 hover:to-blue-700 transition shadow-md"
                    >
                      Actions
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownVisible === user.id && (
                      <div
                        className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-lg w-48 z-50 border overflow-hidden"
                      >
                        <button
                          onClick={() => navigate(`/show-expense/${user.id}`)}
                          className="block px-4 py-2 text-left hover:bg-gray-100 w-full"
                        >
                          Show Expense
                        </button>
                        <button
                          onClick={() => navigate(`/purchase-license/${user.id}`)}
                          className="block px-4 py-2 text-left hover:bg-gray-100 w-full"
                        >
                          Purchase License
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserInformation;
