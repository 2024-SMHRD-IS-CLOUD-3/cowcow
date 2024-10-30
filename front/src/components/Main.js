// Main.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Main.css"; // CSS 파일 불러오기
import logo from "../images/cowcowlogo.png";
import thumbnail from "../images/thumbnail.png";
import thumbnail2 from "../images/thumbnail2.png";

const MainPage = ({ user, setUser }) => {
  const [auctionData, setAuctionData] = useState([]); // 경매 데이터를 저장할 상태
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 관리
  const [showTopButton, setShowTopButton] = useState(false); // 탑 버튼 표시 여부 관리
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    if (window.Kakao.Auth.getAccessToken()) {
      console.log("카카오 로그아웃 중...");
      window.Kakao.Auth.logout(() => {
        console.log("카카오 로그아웃 완료");
        setUser(null);
        localStorage.removeItem("user");
        navigate("/");
      });
    } else {
      setUser(null);
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  const filteredAuctions = auctionData.filter((auction) =>
    auction.aucBroadcastTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await fetch("http://localhost:3001/auctions"); // 경매 데이터 API 호출
        if (!response.ok) {
          console.log("MainPage 에러");
          throw new Error("경매 정보를 가져오는 데 실패했습니다.");
        }
        const data = await response.json();
        setAuctionData(data); // 상태 업데이트
      } catch (error) {
        console.error("Error fetching auction data:", error);
      }
    };

    fetchAuctions();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowTopButton(true);
      } else {
        setShowTopButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="main-container">
      <header className="main-header">
        <h1 style={{ display: "inline" }}>
          <img src={logo} alt="logo" />
        </h1>
        {user && (
          <span style={{ marginLeft: "10px" }}>
            안녕하세요, {user.usrNm}님!
          </span>
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
          {!user ? (
            <>
              <Link to="/login">경매등록</Link>
              <Link to="/login">로그인</Link>
            </>
          ) : (
            <>
              <Link to="/auctionRegister">경매등록</Link>
              <Link to="/myPage">마이페이지</Link>
              <Link to="/" onClick={handleLogout}>
                로그아웃
              </Link>
            </>
          )}
        </nav>
      </header>

      <div className="live-auctions">
        <h2>실시간 경매</h2>
        <div className="auction-list">
          {filteredAuctions.map((auction) => (
            <Link to={`/auctionDetail/${auction.aucSeq}`} key={auction.aucSeq}>
              <div
                className={`auction-card ${auction.aucStatus.toLowerCase()}`}
              >
                <div className="thumbnail-container">
                  <img
                    src={thumbnail}
                    alt={`Thumbnail of ${auction.aucBroadcastTitle}`}
                  />
                  {auction.aucStatus === "진행중" && (
                    <div className="live-badge">LIVE</div>
                  )}
                  <div className="viewer-count">
                    {Math.floor(Math.random() * 200)}명
                  </div>
                </div>
                <div className="auction-info">
                  <h3>{auction.aucBroadcastTitle}</h3>
                  <p>경매 상태: {auction.aucStatus}</p>
                </div>
              </div>
            </Link>
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default MainPage;
