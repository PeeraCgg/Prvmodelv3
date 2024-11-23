import express from 'express';
import { requestOtp, verifyOtp } from "../middleware/verifyOtp.js";
import {
    addOrUpdateUser,
    getUser,
    getEditUser,
    saveEditUser,
    loginLine,
  

       } from '../middleware/profileUser.js'
import { pdpaAccess,
         pdpaShow,
   } from '../middleware/pdpaUser.js';
import { exportStatusUser,
         getUserStatus

} from '../middleware/statusUser.js'
import { getUserPrivilege,
         getProducts,
         redeemProduct,
         getRedeemedHistory,
         getallreward 
} from '../middleware/privilegeUser.js'

import { purchaseLicense ,
          addExpense ,
          deleteExpenseWithTransaction,
          addProducts, 
          deleteProduct,

} from '../middleware/approveUser.js'
const AuthRoutes = express.Router();
// verify
AuthRoutes.post("/requestotp-e", requestOtp);  // requestotp email
AuthRoutes.post("/verifyotp-e",  verifyOtp);   // verify otpemail
// basic information
AuthRoutes.post('/login-line', loginLine);  // login line and save userid
AuthRoutes.post('/add-or-update', addOrUpdateUser);  // add  or update new user 
AuthRoutes.post('/get-user', getUser); // get  information user
AuthRoutes.get('/get-edit-user', getEditUser); // get information edit user after card
AuthRoutes.post('/save-edit-user', saveEditUser);  // update user information after card  
AuthRoutes.post('/pdpa-access', pdpaAccess);  //  accept pdpa
AuthRoutes.get('/pdpa-show', pdpaShow); // show pdpa accept

// status update for pass to card 
AuthRoutes.get('/export-status-user/:userId', exportStatusUser);  // show status user 1,2,3
AuthRoutes.get('/export-status-user', getUserStatus); // show
// Card user to do everything
AuthRoutes.get('/get-user-privilege', getUserPrivilege);  // show type ,point, exp date
AuthRoutes.get('/get-products', getProducts);  // show product user
AuthRoutes.post('/redeem-product', redeemProduct);  // redeem product user
AuthRoutes.get('/redeem-history-user',getRedeemedHistory ); // redeem history user
AuthRoutes.get('/get-all-reward', getallreward ); // get all reward user

// admin approve 
AuthRoutes.post('/purchase-license', purchaseLicense);  // purchase license
AuthRoutes.post('/add-expense', addExpense);  // add expense
AuthRoutes.delete('/delete-expense-with-transaction', deleteExpenseWithTransaction);  // delete expense with transaction
AuthRoutes.post('/add-product', addProducts);  // add product
AuthRoutes.delete('/delete-product/:id', deleteProduct);  // delete product
export default AuthRoutes;