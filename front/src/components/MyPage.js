import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Link import 추가
import './MyPage.css';
import logo from "../images/cowcowlogo.png"


const MyPage = ({ user, setUser }) => {
    const [showTopButton, setShowTopButton] = useState(false);

    const handleScroll = () => {
        setShowTopButton(window.scrollY > 100);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleLogout = () => {
        setUser(null); // 로그아웃 처리
        localStorage.removeItem('user');
        navigate('/'); // 메인 페이지로 리다이렉트
    };

    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate

    return (
        <div className="mypage-layout">
            <Header handleLogout={handleLogout} />
            <div className="content-container">
                <Sidebar />
                <section className="mypage-content">
                    <h1>개인정보 변경</h1>
                    <ProfileInfo user={user} /> {/* user prop 추가 */}
                </section>
            </div>
            {showTopButton && (
                <button id="topButton" onClick={scrollToTop} title="맨 위로">
                    Top
                </button>
            )}
            <Footer />
        </div>
    );
};

const Header = ({ handleLogout }) => (
    <header className="header">
        <div className="logo">
            <Link to="/" className="logo-link"><img src={logo}></img></Link> {/* a 태그를 Link로 변경 */}
        </div>
        <nav className="nav-links">
            <Link to="/">홈</Link> {/* a 태그를 Link로 변경 */}
            <Link to="#">경매등록</Link> {/* a 태그를 Link로 변경 */}
            <Link to="/myPage" className="active">마이페이지</Link> {/* a 태그를 Link로 변경 */}
            <Link to="/" onClick={handleLogout}>로그아웃</Link> {/* 버튼을 Link로 변경 */}
        </nav>
    </header>
);

const Sidebar = () => (
    <aside className="sidebar">
        <ul>
            <li><Link to="/myPage" className="active">개인정보 변경</Link></li> {/* a 태그를 Link로 변경 */}
            <li><Link to="/cowPage">소 등록</Link></li> {/* a 태그를 Link로 변경 */}
            <li><Link to="/transactionHistory">거래 내역</Link></li> {/* a 태그를 Link로 변경 */}
            <li><Link to="/deleteAccount">회원 탈퇴</Link></li> {/* a 태그를 Link로 변경 */}
        </ul>
    </aside>
);

const ProfileInfo = ({ user, userBarn }) => { // user prop 추가
    const [addresses, setAddresses] = useState(['소경매왕']); // 초기 주소 1개

    const handleAddAddress = () => {
        if (addresses.length < 3) {
            setAddresses([...addresses, '']);
        }
    };

    const handleRemoveAddress = (index) => {
        if (addresses.length > 1) {
            const updatedAddresses = addresses.filter((_, i) => i !== index);
            setAddresses(updatedAddresses);
        }
    };

    const handleAddressChange = (index, value) => {
        const updatedAddresses = [...addresses];
        updatedAddresses[index] = value;
        setAddresses(updatedAddresses);
    };

    return (
        <div className="profile-info">
            <InputField label="이름" value={user ? user.usrNm : '이름 없음'} /> {/* null 체크 추가 */}
            <InputField label="이메일" value={user ? user.usrEml : '이메일 없음'} /> {/* null 체크 추가 */}
            <InputField label="전화번호" value={user ? user.usrPhn : '전화번호 없음'} /> {/* null 체크 추가 */}
            <InputField label="농가이름" value={userBarn ? userBarn.userBarnName : '농가정보 없음'} />
            <label className="address-label">농가주소</label>

            {addresses.map((address, index) => (
                <div key={index} className="address-group">
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => handleAddressChange(index, e.target.value)}
                        placeholder="주소를 입력하세요"
                    />
                    <button
                        className="btn add-address"
                        onClick={handleAddAddress}
                        disabled={addresses.length >= 3}
                    >
                        + 주소 추가
                    </button>
                    <button
                        className="btn remove-address"
                        onClick={() => handleRemoveAddress(index)}
                        disabled={addresses.length === 1}
                    >
                        삭제
                    </button>
                </div>
            ))}
        </div>
    );
};

const InputField = ({ label, value }) => (
    <div className="form-group">
        <label>{label}</label>
        <div className="input-wrapper">
            <input type="text" value={value} readOnly />
            <button className="btn change-btn">변경</button>
        </div>
    </div>
);

const Footer = () => (
    <footer className="footer">
        <p>© 2024 소 경매 웹사이트. 모든 권리 보유.</p>
    </footer>
);

export default MyPage;
