import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './components/Main';
import Login from './components/Login';
import SignUp from './components/SignUp';
import MyPage from './components/mypage/MyPage';
import DeleteAccount from './components/mypage/DeleteAccount';
import TransactionHistory from './components/mypage/TransactionHistory';
import AuctionDetail from './components/AuctionDetail';
import CowPage from './components/mypage/CowPage';
import AuctionRegister from './components/AuctionRegister';
import KakaoCallback from './oauth/KakaoCallback';
import './components/theme.css'; 
import Header from './components/Header';

function App() {
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => 
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 테마 설정 useEffect
  useEffect(() => {
    const theme = isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);  // <html>에 data-theme 속성 적용
    localStorage.setItem("theme", theme);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
      <Router>
         <Header user={user} /> {/* Header 컴포넌트 */}
        <Routes>
          <Route path="/" element={<Main user={user} setUser={setUser} toggleTheme={toggleTheme} isDarkMode={isDarkMode} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/kakao-callback" element={<KakaoCallback setUser={setUser} />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/myPage" element={<MyPage user={user} setUser={setUser} toggleTheme={toggleTheme} isDarkMode={isDarkMode} />} />
          <Route path="/deleteAccount" element={<DeleteAccount user={user} setUser={setUser} isDarkMode={isDarkMode} />} />
          <Route path="/transactionHistory" element={<TransactionHistory user={user} setUser={setUser} isDarkMode={isDarkMode} />} />
          <Route path="/auctionDetail/:id" element={<AuctionDetail user={user} setUser={setUser} isDarkMode={isDarkMode} />} />
          <Route path="/cowPage" element={<CowPage user={user} setUser={setUser} isDarkMode={isDarkMode} />} />
          <Route path="/auctionRegister" element={<AuctionRegister user={user} setUser={setUser} isDarkMode={isDarkMode} />} />
        </Routes>
      </Router>
  );
}

export default App;
