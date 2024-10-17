// src/home/MainPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Main.css'; // CSS 파일 불러오기

const MainPage = ({ user, setUser }) => { // user와 setUser를 props로 추가
    const auctionData = Array.from({ length: 10 }, (_, index) => ({
        id: index + 1,
        title: `소 경매 #${index + 1}`,
        viewers: Math.floor(Math.random() * 200),
        status: index % 2 === 0 ? 'LIVE' : '종료',
        thumbnail: `https://placekitten.com/400/200?image=${index + 1}`
    }));

    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 관리
    const [showTopButton, setShowTopButton] = useState(false); // 탑 버튼 표시 여부 관리
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate

    const filteredAuctions = auctionData.filter((auction) =>
        auction.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowTopButton(true);
            } else {
                setShowTopButton(false);
            }
        };

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

    return (
        <div className="main-container">
            <header className="main-header">
                <h1 style={{ display: 'inline' }}>카우카우</h1>
                {user && (
                    <span style={{ marginLeft: '10px' }}>안녕하세요, {user.usrNm}님!</span> // 사용자 이름 표시
                )}
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="경매 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <nav className="nav-links">
                    <Link to="/">홈</Link>
                    <Link to="/auction">경매등록</Link>
                    {!user ? (
                        <Link to="/login">로그인</Link>
                    ) : (
                        <>
                            <Link to="/myPage">마이페이지</Link>
                            <Link to = "/" onClick={handleLogout}>로그아웃</Link>
                        </>
                    )}
                </nav>
            </header>

            <div className="live-auctions">
                <h2>실시간 경매</h2>
                <div className="auction-list">
                    {filteredAuctions.map((auction) => (
                        <div key={auction.id} className={`auction-card ${auction.status.toLowerCase()}`}>
                            <div className="thumbnail-container">
                                <img src={auction.thumbnail} alt={`Thumbnail of ${auction.title}`} />
                                {auction.status === 'LIVE' && (
                                    <div className="live-badge">LIVE</div>
                                )}
                                <div className="viewer-count">{auction.viewers}명</div>
                            </div>
                            <div className="auction-info">
                                <h3>{auction.title}</h3>
                                <p>경매 상태: {auction.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showTopButton && (
                <button className="top-button" onClick={scrollToTop}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default MainPage;
