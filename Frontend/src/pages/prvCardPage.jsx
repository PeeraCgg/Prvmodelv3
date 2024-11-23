import { useState, useEffect , useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { getLineUserId } from '../utils/storage'; // ดึง lineUserId จาก Local Storage
import axios from 'axios';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [expireDate, setExpireDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [points, setPoints] = useState(0);
  const [prvType, setPrvType] = useState('');
  const maxPoints = 10000;
  const progressWidth = Math.min((points / maxPoints) * 100, 100);
  const lineUserId = getLineUserId();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
 // ฟังก์ชันตรวจจับการคลิกนอกเมนู
 useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false); // ปิดเมนูเมื่อคลิกนอกเมนู
      }
    };

    // เพิ่ม event listener สำหรับการคลิก
    document.addEventListener('mousedown', handleClickOutside);

    // ลบ event listener เมื่อ component ถูก unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ฟังก์ชันสำหรับดึงข้อมูล privilege
  const fetchUserData = async () => {
    if (!lineUserId) {
      alert('Line User ID is missing. Please log in again.');
      navigate('/');
      return;
    }

    try {
      setLoading(true);

      const privilegeResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/get-user-privilege`,
        { params: { lineUserId } }
      );

      const { prvType, prvExpiredDate, currentPoint } = privilegeResponse.data.data;

      setExpireDate(prvExpiredDate);
      setPoints(currentPoint);
      setPrvType(prvType);

      console.log('Privilege Data:', { prvType, prvExpiredDate, currentPoint });
    } catch (error) {
      console.error('Error fetching user data:', error);
      alert('Failed to load user data.');
    } finally {
      setLoading(false);
    }
  };

  // ใช้ useEffect เพื่อดึงข้อมูลเมื่อ component ถูก mount
  useEffect(() => {
    fetchUserData();
  }, []); // [] ทำให้ useEffect ทำงานเพียงครั้งเดียวตอน mount

  // ฟังก์ชันสำหรับกำหนดสีพื้นหลังตามประเภทสมาชิก
  const getBackgroundColor = (type) => {
    switch (type.toLowerCase()) {
      case 'silver':
        return 'bg-gray-400';
      case 'gold':
        return 'bg-yellow-500';
      case 'platinum':
        return 'bg-gray-300';
      case 'diamond':
        return 'bg-blue-600';
      default:
        return 'bg-gray-400'; // ค่าเริ่มต้น
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        <div className={`p-6 rounded-lg mb-6 relative ${getBackgroundColor(prvType)}`}>
          <div className="flex justify-between items-center mb-4 relative">
            <h1 className="text-xl font-bold text-white">Profile</h1>
            <button onClick={toggleMenu} className="focus:outline-none">
              <div className="space-y-1">
                <div className="w-6 h-0.5 bg-white"></div>
                <div className="w-6 h-0.5 bg-white"></div>
                <div className="w-6 h-0.5 bg-white"></div>
              </div>
            </button>

            {menuOpen && (
              <div
               ref={menuRef}
                className="bg-white shadow-md rounded-md absolute right-0 mt-2 w-40 z-20"
              >
                <ul>
                  <li
                    className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate('/editprofile')}
                  >
                    Edit profile
                  </li>
                  <li
                    className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate('/pdpashow')}
                  >
                    Consent
                  </li>
                  <li
                    className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate('/allreward')}
                  >
                    All Rewards
                  </li>
                  <li
                    className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate('/redeemedhistory')}
                  >
                    History Redeem
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="p-8 text-white">
            <div>
              <h2 className="text-lg font-bold">{prvType}</h2>
              <p className="text-sm">Points Earned</p>
              <p className="text-2xl font-semibold">
                {points}/{maxPoints}
              </p>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2 mt-4">
              <div
                className="bg-yellow-400 h-2 rounded-full"
                style={{ width: `${progressWidth}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mb-6">
          <p className="font-semibold">Expire Date</p>
          <p>
            {loading ? 'Loading...' : expireDate ? new Date(expireDate).toLocaleDateString() : 'N/A'}
          </p>
        </div>

        {/* Terms and Conditions Section */}
        <div className="mb-6">
          <h3 className="font-bold mb-2">Terms and Conditions</h3>
          <p className="text-sm text-gray-600">
            By using our service, you agree to the following terms and conditions. Please read carefully before proceeding.
          </p>
        </div>

        {/* View Rewards Button */}
        <button
          onClick={() => navigate('/viewreward')}
          className="bg-green-600 text-white py-3 px-3 w-full rounded-md hover:bg-green-700 transition"
        >
          View Rewards
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
