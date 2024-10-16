import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Link import 추가
import './TransactionHistory.css'; // CSS 파일 import

const TransactionHistory = ({ user, setUser }) => { // user와 setUser 추가
    const [filter, setFilter] = useState('전체');

    const transactions = [
        { id: 1, type: '판매', cow: '소001', date: '2024-10-01', price: '₩1,000,000' },
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
        setUser(null); // 로그아웃 처리
    };

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
            <Link to="/" className="logo-link">카우카우</Link> {/* a 태그를 Link로 변경 */}
        </div>
        <nav className="nav-links">
            <Link to="/">홈</Link> {/* a 태그를 Link로 변경 */}
            <Link to="#">출장우 조회</Link> {/* a 태그를 Link로 변경 */}
            <Link to="/myPage">마이페이지</Link> {/* a 태그를 Link로 변경 */}
            <Link to="/transactionHistory" className="active">거래 내역</Link> {/* a 태그를 Link로 변경 */}
            <Link to="/" onClick={handleLogout}>로그아웃</Link> {/* 버튼을 Link로 변경 */}
        </nav>
    </header>
);

const Sidebar = () => (
    <aside className="sidebar">
        <ul>
            <li><Link to="/myPage">개인정보 변경</Link></li> {/* a 태그를 Link로 변경 */}
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
