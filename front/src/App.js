import { useEffect, useState } from 'react';
// import UserList from './components/UserList';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './components/Main'
import Login from './components/Login';
import SignUp from './components/SignUp';


function App() {
  const [data, setData] = useState([]);

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
    // <div>
    //   <UserList users={data} /> {/* UserList에 users prop 전달 */}
    // </div>
    <Router>
      <Routes>
        <Route path="/" element={<Main/>}></Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;

