import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Link import 추가
import './TransactionHistory.css'; // CSS 파일 import
import logo from "../images/cowcowlogo.png"


const TransactionHistory = ({ user, setUser }) => { // user와 setUser 추가
    const [filter, setFilter] = useState('전체');
    const [transaction, setTransaction] = useState(null);

    const transactions = [
        { id: 2, type: '구매', cow: '소101', date: '2024-09-15', price: '₩900,000' },
        { id: 3, type: '판매', cow: '소002', date: '2024-10-10', price: '₩1,200,000' },
        { id: 4, type: '구매', cow: '소102', date: '2024-09-20', price: '₩850,000' },
    ];

    const filteredTransactions = transactions.filter(tx =>
        filter === '전체' ? true : tx.type === filter
    );

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const handleLogout = () => {
        // if (window.Kakao.Auth.getAccessToken()) {
        //   console.log("카카오 로그아웃 중...");
        //   window.Kakao.Auth.logout(() => {
        //     console.log("카카오 로그아웃 완료");
        //     setUser(null);
        //     localStorage.removeItem("user");
        //     navigate("/");
        //   });
        // } else {
        //   setUser(null);
        //   localStorage.removeItem("user");
        //   navigate("/");
        // }

        setUser(null);
        localStorage.removeItem("user");
        navigate("/");
      };
      
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate

    return (
        <div className="transaction-layout">
            <Header handleLogout={handleLogout} /> {/* handleLogout 추가 */}
            <div className="content-container">
                <Sidebar />
                <section className="transaction-content">
                    <h1>거래 내역</h1>

                    <div className="filter-container">
                        <select
                            className="filter-dropdown"
                            value={filter}
                            onChange={handleFilterChange}
                        >
                            <option value="전체">전체</option>
                            <option value="구매">구매</option>
                            <option value="판매">판매</option>
                        </select>
                    </div>

                    <TransactionTable transactions={filteredTransactions} />
                </section>
            </div>
            <Footer />
        </div>
    );
};

const TransactionTable = ({ transactions }) => (
    <table className="transaction-table">
        <thead>
            <tr>
                <th>번호</th>
                <th>거래 유형</th>
                <th>소 번호</th>
                <th>날짜</th>
                <th>가격</th>
            </tr>
        </thead>
        <tbody>
            {transactions.map((tx, index) => (
                <tr key={tx.id}>
                    <td>{index + 1}</td>
                    <td>{tx.type}</td>
                    <td>{tx.cow}</td>
                    <td>{tx.date}</td>
                    <td>{tx.price}</td>
                </tr>
            ))}
        </tbody>
    </table>
);

const Header = ({ handleLogout }) => (
    <header className="header">
        <div className="logo">
            <Link to="/" className="logo-link"><img src={logo}></img></Link> {/* a 태그를 Link로 변경 */}
        </div>
        <nav className="nav-links">
            <Link to="/">홈</Link> {/* a 태그를 Link로 변경 */}
            <Link to="/auctionRegister">경매등록</Link> {/* a 태그를 Link로 변경 */}
            <Link to="/myPage"  className="active">마이페이지</Link> {/* a 태그를 Link로 변경 */}
            <Link to="/" onClick={handleLogout}>로그아웃</Link> {/* 버튼을 Link로 변경 */}
        </nav>
    </header>
);

const Sidebar = () => (
    <aside className="sidebar">
        <ul>
            <li><Link to="/myPage">개인정보 변경</Link></li> {/* a 태그를 Link로 변경 */}
            <li><Link to="/cowPage">소 등록</Link></li> {/* a 태그를 Link로 변경 */}
            <li><Link to="/transactionHistory" className="active">거래 내역</Link></li> {/* a 태그를 Link로 변경 */}
            <li><Link to="/deleteAccount">회원 탈퇴</Link></li> {/* a 태그를 Link로 변경 */}
        </ul>
    </aside>
);

const Footer = () => (
    <footer className="footer">
        <p>© 2024 소 경매 웹사이트. 모든 권리 보유.</p>
    </footer>
);

export default TransactionHistory;
