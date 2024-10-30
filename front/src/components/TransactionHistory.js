import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './TransactionHistory.css';
import logo from "../images/cowcowlogo.png";

const TransactionHistory = ({ user, setUser }) => {
    const [filter, setFilter] = useState('전체');
    const [transactions, setTransactions] = useState([]); // 초기 상태를 빈 배열로 설정
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch(`http://localhost:3001/auction-cows/completed`);
                if (!response.ok) throw new Error('거래 내역을 불러오는 데 실패했습니다.');

                const data = await response.json();
                setTransactions(data); // 거래 내역 설정
            } catch (error) {
                console.error('Error fetching transactions:', error);
                alert('거래 내역을 불러오지 못했습니다.');
            }
        };

        fetchTransactions();
    }, []);

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
        navigate("/");
    };

    const filteredTransactions = transactions.filter((tx) =>
        filter === '전체' ? true : tx.type === filter
    );

    return (
        <div className="transaction-layout">
            <Header handleLogout={handleLogout} />
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

                    {/* TransactionTable 컴포넌트 조건부 렌더링 */}
                    {filteredTransactions.length > 0 ? (
                        <TransactionTable transactions={filteredTransactions} />
                    ) : (
                        <p>거래 내역이 없습니다.</p>
                    )}
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
                <tr key={tx.acowSeq}>
                    <td>{index + 1}</td>
                    <td>{tx.type || "보류"}</td>
                    <td>{tx.cow?.cowNo || "정보없음"}</td>
                    <td>{new Date(tx.acowDelDt).toLocaleDateString()}</td>
                    <td>{tx.acowFinalBid.toLocaleString()}만원</td>
                </tr>
            ))}
        </tbody>
    </table>
);

const Header = ({ handleLogout }) => (
    <header className="header">
        <div className="logo">
            <Link to="/" className="logo-link">
                <img src={logo} alt="logo" />
            </Link>
        </div>
        <nav className="nav-links">
            <Link to="/">홈</Link>
            <Link to="/auctionRegister">경매등록</Link>
            <Link to="/myPage">마이페이지</Link>
            <Link to="/" onClick={handleLogout}>로그아웃</Link>
        </nav>
    </header>
);

const Sidebar = () => (
    <aside className="sidebar">
        <ul>
            <li><Link to="/myPage">개인정보 변경</Link></li>
            <li><Link to="/cowPage">소 등록</Link></li>
            <li><Link to="/transactionHistory" className="active">거래 내역</Link></li>
            <li><Link to="/deleteAccount">회원 탈퇴</Link></li>
        </ul>
    </aside>
);

const Footer = () => (
    <footer className="footer">
        <p>© 2024 소 경매 웹사이트. 모든 권리 보유.</p>
    </footer>
);

export default TransactionHistory;
