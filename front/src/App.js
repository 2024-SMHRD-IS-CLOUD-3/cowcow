import { useEffect, useState } from 'react';
import UserList from './components/UserList';

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
    <div>
      <UserList users={data} /> {/* UserList에 users prop 전달 */}
    </div>
  );
}

export default App;
