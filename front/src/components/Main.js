import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Main.css"; // CSS 파일 불러오기
import logo from "../images/cowcowlogo.png";
import thumbnail from "../images/thumbnail.png";
import './theme.css'; // theme.css

const MainPage = ({ user, setUser, isDarkMode, toggleTheme }) => {
  const [auctionData, setAuctionData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showTopButton, setShowTopButton] = useState(false);
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  const filteredAuctions = auctionData.filter((auction) =>
    auction.aucBroadcastTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await fetch("http://localhost:3001/auctions");
        if (!response.ok) {
          console.log("MainPage 에러");
          throw new Error("Failed to fetch auctions.");
        }
        const data = await response.json();
        setAuctionData(data);
      } catch (error) {
        console.error("Error fetching auction data:", error);
      }
    };
    fetchAuctions();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <header className={`main-header ${isDarkMode ? "dark" : "light"}`}>
        <h1>
          <img src={logo} alt="logo" />
        </h1>
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
        <div className="auction-list">
          {filteredAuctions.map((auction) => (
            <Link to={`/auctionDetail/${auction.aucSeq}`} key={auction.aucSeq}>
              <div className={`auction-card ${auction.aucStatus.toLowerCase()}`}>
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
                <div>
                  <h3 className={`auction-info ${isDarkMode ? "dark" : "light"}`}>{auction.aucBroadcastTitle}</h3>
                  <p className={`auction-info ${isDarkMode ? "dark" : "light"}`}>경매 상태: {auction.aucStatus}</p>
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}

      <button
        className={`theme-toggle-button ${isDarkMode ? "dark" : "light"}`}
        onClick={toggleTheme}
      >
        {isDarkMode ? "🌞" : "🌙"}
      </button>
    </div>
  );
};

export default MainPage;
