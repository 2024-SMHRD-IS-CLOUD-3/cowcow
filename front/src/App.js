import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './components/Main';
import Login from './components/Login';
import SignUp from './components/SignUp';
import MyPage from './components/MyPage';  
import DeleteAccount from './components/DeleteAccount'; 
import TransactionHistory from './components/TransactionHistory';

function App() {
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null); // 로그인한 사용자 상태 관리

  useEffect(() => {
    // NestJS 서버(3001번 포트)에 있는 API 호출
    fetch('http://localhost:3001/users') // API 경로 확인
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
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
      </Routes>
    </Router>
  );
}

export default App;
