import { Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/welcomePage";
import ProfilePage from "./pages/profilePage";
import PdpaPage from "./pages/pdpaPage";
import LoginWithLine from "./pages/lineLoginPage";
import TwoWayVerify from "./pages/twoWayVerify";
import EmailVerifyOtp from "./pages/emailVerify";
import PrvCardPage from "./pages/prvCardPage";
import EditProfilePage from "./pages/editProfilePage";
import ShowPdpa from "./pages/pdpashowPage";
import ViewRewardPage from "./pages/viewRewardPage";
import RedeemedHistoryPage from "./pages/historyProductPage";
import AllRewardsPage from "./pages/allrewardPage";
function App() {
 
    return(  
    <Routes>
      {/* Define your routes here */}
      <Route path="/" element={<LoginWithLine />} />
      <Route path="/welcomepage" element={<WelcomePage />} />
      <Route path="/profilePage" element={<ProfilePage />} />
      <Route path="/pdpaPage" element={<PdpaPage />} />
      <Route path="/twowayverify" element={<TwoWayVerify />} />
      <Route path="/emailverify" element={<EmailVerifyOtp />} />
      <Route path="/prvcard" element={< PrvCardPage/>} />
      <Route path="/editprofile" element={< EditProfilePage/>} />
      <Route path="/pdpashow" element={< ShowPdpa/>} />
      <Route path="/viewreward" element={< ViewRewardPage />} />
      <Route path="/redeemedhistory" element={< RedeemedHistoryPage />} />
      <Route path="/allreward" element={< AllRewardsPage />} />
    </Routes>
    )};
 
export default App
