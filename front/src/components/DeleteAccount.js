import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Link 및 useNavigate import 추가
import './DeleteAccount.css'; // CSS 파일 import
import logo from "../images/cowcowlogo.png"

const DeleteAccount = ({ user, setUser }) => { // user, setUser prop 추가
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate

    const handleLogout = () => {
        setUser(null); // 로그아웃 처리
        localStorage.removeItem('user');
        navigate('/'); // 메인 페이지로 리다이렉트
    };

    const handleDelete = async () => {
        if (window.confirm('정말로 회원 탈퇴를 진행하시겠습니까?')) {
            try {
                console.log(user)
                console.log(user.usrSeq)
                if (user && user.usrSeq) {
                    // 회원 탈퇴 API 호출
                    const response = await fetch(`http://localhost:3001/users/${user.usrSeq}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include', // 쿠키 인증이 필요한 경우 사용
                    });

                    if (!response.ok) {
                        throw new Error('회원 탈퇴 실패');
                    }

                    alert('회원 탈퇴가 완료되었습니다.');
                    setUser(null); // 로그아웃 처리
                    navigate('/'); // 메인 페이지로 이동
                } else {
                    alert('사용자 정보가 없습니다.');
                }
            } catch (error) {
                console.error('회원 탈퇴 중 오류가 발생했습니다:', error);
                alert('회원 탈퇴 중 오류가 발생했습니다. 다시 시도해 주세요.');
            }
        }
    };

    return (
        <div className="delete-account-layout">
            <Header handleLogout={() => setUser(null)} /> {/* handleLogout 추가 */}
            <div className="content-container">
                <Sidebar />
                <div className="content-center">
                    <Warning />
                    <button className="delete-btn" onClick={handleDelete}>
                        회원탈퇴
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

const Warning = () => (
    <div className="warning">
        <h2>회원탈퇴 시 유의사항</h2>
        <p>1. 탈퇴 후에는 계정 복구가 불가능합니다.</p>
        <p>2. 모든 개인 정보 및 거래 내역이 삭제됩니다.</p>
        <p>3. 탈퇴 후 동일한 이메일로 재가입이 불가능합니다.</p>
    </div>
);

const Header = ({ handleLogout }) => (
    <header className="header">
        <div className="logo">
            <Link to="/" className="logo-link"><img src={logo}></img></Link> {/* a 태그를 Link로 변경 */}
        </div>
        <nav className="nav-links">
            <Link to="/">홈</Link> {/* a 태그를 Link로 변경 */}
            <Link to="/myPage">마이페이지</Link> {/* a 태그를 Link로 변경 */}
            <Link to="/" onClick={handleLogout}>로그아웃</Link> {/* 버튼을 Link로 변경 */}
        </nav>
    </header>
);

const Sidebar = () => (
    <aside className="sidebar">
        <ul>
            <li><Link to="/myPage">개인정보 변경</Link></li> {/* a 태그를 Link로 변경 */}
            <li><Link to="/transactionHistory">거래 내역</Link></li> {/* a 태그를 Link로 변경 */}
            <li><Link to="/cowPage">경매 등록</Link></li> {/* a 태그를 Link로 변경 */}
            <li><Link to="/deleteAccount" className="active">회원 탈퇴</Link></li> {/* a 태그를 Link로 변경 */}
        </ul>
    </aside>
);

const Footer = () => (
    <footer className="footer">
        <p>© 2024 소 경매 웹사이트. 모든 권리 보유.</p>
    </footer>
);

export default DeleteAccount;
