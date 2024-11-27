import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AddExpense = () => {
  const { userId } = useParams(); // Get userId from the URL
  const navigate = useNavigate();

  const [expenseAmount, setExpenseAmount] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  
  useEffect(() => {
    // Set default date to today's date
    const today = new Date().toISOString().split('T')[0];
    setTransactionDate(today);
  }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://localhost:3001/user/add-expense/${userId}`, {
        expenseAmount: parseFloat(expenseAmount),
        transactionDate,
      });

      // Show success message using SweetAlert2
      Swal.fire({
        icon: 'success',
        title: 'Expense Added!',
        text: response.data.message,
        timer: 2000, // แสดงข้อความเป็นเวลา 2 วินาที
        timerProgressBar: true, // แสดงแถบความคืบหน้า
        showConfirmButton: false, // ซ่อนปุ่ม OK
      });

      // Redirect to user profile or summary page after a short delay
      setTimeout(() => navigate(`/userinformation`), 2000);
    } catch (err) {
      // Show error message using SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.error || 'Failed to add expense',
        confirmButtonText: 'Try Again',
      });
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Add Expense</h2>
      <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="expenseAmount" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Expense Amount (THB):
          </label>
          <input
            type="number"
            id="expenseAmount"
            value={expenseAmount}
            onChange={(e) => setExpenseAmount(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          />
        </div>
        <div>
          <label htmlFor="transactionDate" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Transaction Date:
          </label>
          <input
            type="date"
            id="transactionDate"
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
