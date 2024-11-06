import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Main.css"; // CSS 파일 불러오기
import logo from "../images/cowcowlogo.png";
import thumbnail1 from "../images/thumbnail1.png";
import thumbnail2 from "../images/thumbnail2.png";
import thumbnail3 from "../images/thumbnail3.png";
import thumbnail4 from "../images/thumbnail4.png";
import thumbnail5 from "../images/thumbnail5.png";
import thumbnail6 from "../images/thumbnail6.png";
import thumbnail7 from "../images/thumbnail7.png";

const MainPage = ({ user, setUser }) => {
  const [auctionData, setAuctionData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showTopButton, setShowTopButton] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [randomThumbnail, setRandomThumbnail] = useState([]);
  const navigate = useNavigate();

  // Array of all thumbnails
  const thumbnails = [
    thumbnail1,
    thumbnail2,
    thumbnail3,
    thumbnail4,
    thumbnail5,
    thumbnail6,
    thumbnail7,
  ];

  // Function to get random thumbnails
  const getRandomThumbnails = () => {
    return auctionData.map(() => {
      const randomIndex = Math.floor(Math.random() * thumbnails.length);
      return thumbnails[randomIndex];
    });
  };

  useEffect(() => {
    setRandomThumbnail(getRandomThumbnails());
  }, [auctionData]);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);
    document.body.className = newTheme + "-mode";
  };

  useEffect(() => {
    document.body.className = isDarkMode ? "dark-mode" : "light-mode";
  }, [isDarkMode]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    // if (window.Kakao.Auth.getAccessToken()) {
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
  // };
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

  useEffect(() => {
    auctionData.forEach((auction) => {
      console.log("auction.aucStatus: ", auction.auctionCows.every((cow) => cow.acowStatus === '낙찰'));
      console.log("auction.aucSeq: ", auction.aucSeq);
      if (auction.aucStatus === '진행중' && auction.auctionCows.every((cow) => cow.acowStatus === '낙찰')) {
        updateAuctionStatus(auction.aucSeq);
      }
    });
  }, [auctionData]);
  
  const updateAuctionStatus = async (auctionId) => {
    try {
      const response = await fetch(`http://localhost:3001/auctions/${auctionId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ aucStatus: '종료' }),
      });
  
      if (!response.ok) {
        throw new Error('경매 상태 업데이트에 실패했습니다.');
      }
  
      setAuctionData((prevData) =>
        prevData.map((auction) =>
          auction.aucSeq === auctionId ? { ...auction, aucStatus: '종료' } : auction
        )
      );
    } catch (error) {
      console.error('Error updating auction status:', error);
    }
  };

  return (
    <div className="main-container">
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
          {filteredAuctions.map((auction, index) => (
            <Link to={`/auctionDetail/${auction.aucSeq}`} key={auction.aucSeq}>
              <div className={`auction-card ${auction.aucStatus.toLowerCase()}`}>
                <div className="thumbnail-container">
                <img
                    src={randomThumbnail[index]}
                    alt={`Thumbnail of ${auction.aucBroadcastTitle}`}
                  />
                  {auction.aucStatus === "진행중" && (
                    <div className="live-badge">LIVE</div>
                  )}
                  <div className="viewer-count">
                    {Math.floor(Math.random() * 200)}명
                  </div>
                </div>
              </div>
              <div>
                {/* TODO : 모든 소 낙찰 -> 경매상태 : 종료 */}
                <h3 className={`auction-info ${isDarkMode ? "dark" : "light"}`}>{auction.aucBroadcastTitle}</h3>
                <p className={`auction-info ${isDarkMode ? "dark" : "light"}`}>경매 상태: {auction.aucStatus}</p>
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
