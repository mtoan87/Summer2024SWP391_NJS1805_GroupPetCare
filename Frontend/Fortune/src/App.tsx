import React, { useEffect } from 'react';
import './App.scss';
/*-------------------------------AUTHENTICAL----------------------------------------------*/
import GuestHomePg from './WebApplication/GuestPage/guest-home-page/guest-home-pg';
import RegisterPg from './WebApplication/AccountRegister/components/pages/Register-pg';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Loginpg from './WebApplication/AccountRegister/components/pages/Loginpg';
import ForgotPass from './WebApplication/AccountRegister/components/pages/forgotPage';

/*--------------------------MEMEBER----------------------------------------------*/
import MemberHomePg from './WebApplication/MemberPage/components/pages/member-home-pg/member-home-pg';
import { UserProvider, useUser } from './WebApplication/Data/UserContext';
import MemberAuctionPg from './WebApplication/MemberPage/components/pages/member-auction-pg/memberauctionPg';
import JewelryUploadPg from './WebApplication/MemberPage/components/pages/member-jewelry-upload-pg/jewelry-upload-pg';
import MemberJewelryPg from './WebApplication/MemberPage/components/pages/member-Jewelry-pg/member-jewelry-pg';
import MemberViewJewelryPg from './WebApplication/MemberPage/components/pages/member-Jewelry-pg/member-View-Jewelry-Details-Pg';
import ManagerHomePg from './WebApplication/ManagerPage/component/pages/ManagerHomePg';
import MemberAucDetailsPg from './WebApplication/MemberPage/components/pages/member-auction-details-pg/member-auction-details-pg';
const App: React.FC = () => {
  const { user, setUser } = useUser();
  useEffect(() => {
    const storedUser = sessionStorage.getItem("loginedUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  return (
    <>
      <Routes>
        <Route path='/'>
          {user === null ? (
            <>
              <Route index element={<GuestHomePg />} />
              <Route path='register' element={<RegisterPg />} />
              <Route path='forgotpass' element={<ForgotPass />} />
              <Route path='login' element={<Loginpg />} />
            </>
          ) : (
            <>
              <Route path='/login' element={<Loginpg />} />
              {user.role === 1 && (
                <>
                  {/* Add your admin routes here */}
                </>
              )}
              {user.role === 2 && (
                <>
                  <Route index element={<MemberHomePg />} />
                  <Route path="/auction/:id" element ={<MemberAucDetailsPg />} />
                  <Route path='/userAuc' element={<MemberAuctionPg />} />
                  <Route path='/userJewel/upload' element={<JewelryUploadPg />} />
                  <Route path='/userJewel' element={<MemberJewelryPg />} />
                  <Route path='/ViewJewInfo/:id' element={<MemberJewelryPg />} />
                  {/* <Route path='/userJewel/:id' element={<MemberJewelryPg />} /> */}
                  <Route path="/update-jewelry/:id" element={<MemberViewJewelryPg />} />
                </>
              )}
              {user.role === 3 && (
                <>
                  {/* Add your staff routes here */}
                </>
              )}
              {user.role === 5 && (
                <>
                  {/* Add your manager routes here */}
                  <Route index element={<ManagerHomePg />} />
                </>
              )}
            </>
          )}
        </Route>
      </Routes>
    </>
  );
};

const AppWrapper: React.FC = () => (
  <UserProvider>
    <App />
  </UserProvider>
);

export default AppWrapper;
