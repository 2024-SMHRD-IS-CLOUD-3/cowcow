// App.js
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './components/Main';
import Login from './components/Login';
import SignUp from './components/SignUp';
import MyPage from './components/MyPage';
import DeleteAccount from './components/DeleteAccount';
import TransactionHistory from './components/TransactionHistory';
import AuctionDetail from './components/AuctionDetail';
import CowPage from './components/CowPage';
import AuctionRegister from './components/AuctionRegister';

function App() {
  const [user, setUser] = useState(null); // 로그인한 사용자 상태 관리

  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보 가져오기
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // 사용자 정보를 상태에 설정
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main user={user} setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/myPage" element={<MyPage user={user} setUser={setUser} />} />
        <Route path="/deleteAccount" element={<DeleteAccount user={user} setUser={setUser} />} />
        <Route path="/transactionHistory" element={<TransactionHistory user={user} setUser={setUser} />} />
        <Route path="/auctionDetail/:id" element={<AuctionDetail user={user} setUser={setUser} />} />
        <Route path="/cowPage" element={<CowPage user={user} setUser={setUser} />} />
        <Route path="/auctionRegister" element={<AuctionRegister user={user} setUser={setUser}/>}/>
</Routes>
    </Router>
  );
}

export default App;
