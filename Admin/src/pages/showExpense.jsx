import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams , useNavigate } from 'react-router-dom';


const ExpenseHistory = () => {
  const { userId } = useParams(); // ดึง userId จาก URL
  const navigate = useNavigate(); // ใช้สำหรับเปลี่ยนเส้นทาง
  const [expenseHistory, setExpenseHistory] = useState([]);
  const [totalAmountPerYear, setTotalAmountPerYear] = useState(0);
  const [prvType, setPrvType] = useState('');
  const [error, setError] = useState('');
 
  

  useEffect(() => {
    // ดึงข้อมูลประวัติการใช้จ่ายจาก backend
    const fetchExpenseHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/user/show-expense/${userId}`);
        setExpenseHistory(response.data.data.expenses);
        setTotalAmountPerYear(response.data.data.totalAmountPerYear);
        setPrvType(response.data.data.prvType);
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch expense history');
      }
    };

    fetchExpenseHistory();
  }, [userId]);
  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;

    try {
      await axios.delete(`http://localhost:3001/user/delete-expense/${expenseId}`);
      setExpenseHistory((prev) => prev.filter((expense) => expense.id !== expenseId));
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete expense');
    }
  };
  const handleAddExpense = () => {
    // เปลี่ยนเส้นทางไปยังหน้าเพิ่มค่าใช้จ่าย
    navigate(`/add-expense/${userId}`);
  };
  const handleDashboard= () => {
    // เปลี่ยนเส้นทางไปยังหน้าเพิ่มค่าใช้จ่าย
    navigate("/dashboard");
  };

  return (
    <div className="h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Expense History</h1>

      {/* แสดงสถานะผู้ใช้ */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <p><strong>Total Amount Per Year:</strong> {totalAmountPerYear}</p>
        <p><strong>Privilege Type:</strong> {prvType}</p>
        <div className="flex space-x-4 mt-4">
        <button
        onClick={handleAddExpense}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
             Add Expense
             </button>
            <button
         onClick={handleDashboard}
         className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
            Dashboard
         </button>
</div>

      </div>

      {/* ตารางประวัติการใช้จ่าย */}
      <div className="bg-white p-6 rounded shadow">
        {error && <p className="text-red-500">{error}</p>}
        {expenseHistory.length > 0 ? (
          <table className="table-auto w-full text-left">
            <thead>
              <tr>
                <th className="px-4 py-2">Transaction Date</th>
                <th className="px-4 py-2">Expense Amount</th>
                <th className="px-4 py-2">Privilege Type</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenseHistory.map((expense) => (
                <tr key={expense.id}>
                  <td className="border px-4 py-2">{new Date(expense.transactionDate).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">{expense.expenseAmount}</td>
                  <td className="border px-4 py-2">{expense.prvType}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No expense history available.</p>
        )}
      </div>
    </div>
  );
};

export default ExpenseHistory;
