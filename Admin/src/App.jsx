import { Routes, Route } from "react-router-dom";
import AdminLogin from "./components/adminLogin";
import Dashboard from "./pages/dashboardPage";
import UserInformation from "./pages/userInformation";
import PurchaseLicense  from "./pages/purchaseLicense";
import ExpenseHistory from "./pages/showExpense";
import AddExpense from "./pages/addExpense";
import AllProduct from "./pages/allProduct";
import AddProduct from "./pages/addProduct";
const App = () => {


  return (
   <Routes>
    <Route path="/" element={<AdminLogin />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/userinformation" element={<UserInformation />} />
    <Route path="/purchase-license/:id" element={<PurchaseLicense />} /> 
    <Route path="/show-expense/:userId" element={<ExpenseHistory />} />
    <Route path="/add-expense/:userId" element={<AddExpense />} />
    <Route path="/all-product" element={<AllProduct />} />
    <Route path="/add-product" element={<AddProduct />} />
   </Routes>
     
  )
}

export default App
