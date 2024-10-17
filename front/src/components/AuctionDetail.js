// src/home/AuctionDetail.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Link import 추가
import "./AuctionDetail.css";

const AuctionDetail = ({ user, setUser }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { src: "/images/소1.jfif", alt: "경매 소 이미지 1" },
    { src: "/images/소2.jfif", alt: "경매 소 이미지 2" },
    { src: "/images/소3.jfif", alt: "경매 소 이미지 3" },
    { src: "/images/소4.jfif", alt: "경매 소 이미지 4" },
  ];

  const showSlide = (index) => {
    if (index >= slides.length) setCurrentSlide(0);
    else if (index < 0) setCurrentSlide(slides.length - 1);
    else setCurrentSlide(index);
  };

  const handleLogout = () => {
    setUser(null); // 로그아웃 처리
    localStorage.removeItem("user");
    navigate("/"); // 메인 페이지로 리다이렉트
  };

  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate

  const nextSlide = () => showSlide(currentSlide + 1);
  const prevSlide = () => showSlide(currentSlide - 1);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    showSlide(currentSlide);
  }, [currentSlide]);

  return (
    <div className="auction-detail-container">
      <header className="header">
        <div className="logo">
          <Link to="/" className="logo-link">
            <h1 style={{ display: "inline" }}>카우카우</h1>
          </Link>{" "}
          {/* a 태그를 Link로 변경 */}
        </div>
        <nav className="nav-links">
          <Link to="/">홈</Link> {/* a 태그를 Link로 변경 */}
          <Link to="/auction">경매등록</Link>
          {!user ? (
            <Link to="/login">로그인</Link>
          ) : (
            <>
              <Link to="/myPage">마이페이지</Link>
              <Link to="/" onClick={handleLogout}>
                로그아웃
              </Link>
            </>
          )}
        </nav>
      </header>

      <section className="auction-detail">
        <div className="auction-content">
          <div className="video-container">
            <video id="liveStream" controls autoPlay muted>
              <source src="rtmp://your-stream-url" type="video/mp4" />
              브라우저가 동영상을 지원하지 않습니다.
            </video>
          </div>

          <div className="auction-details">
            <table className="details-table">
              <tbody>
                <tr>
                  <th>소 이름</th>
                  <td>명품 한우</td>
                </tr>
                <tr>
                  <th>예상 낙찰가</th>
                  <td>5,000,000원</td>
                </tr>
                <tr>
                  <th>출생일</th>
                  <td>2020-04-15</td>
                </tr>
                <tr>
                  <th>성별</th>
                  <td>암소</td>
                </tr>
                <tr>
                  <th>상태</th>
                  <td>건강</td>
                </tr>
                <tr>
                  <th>현재 최고 입찰가</th>
                  <td>6,500,000원</td>
                </tr>
              </tbody>
            </table>

            <div className="bid-section-inline">
              <input
                type="number"
                placeholder="입찰 금액 입력"
                className="bid-input"
              />
              {!user ? (
                <Link to="/login">
                  <button className="btn primary">입찰하기</button>
                </Link>
              ) : (
                <button className="btn primary">입찰하기</button>
              )}
            </div>
          </div>
        </div>

        <div className="slider-container">
          <div
            className="slider"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div key={index} className="slide">
                <img src={slide.src} alt={slide.alt} />
              </div>
            ))}
          </div>
          <button className="prev" onClick={prevSlide}>
            &#10094;
          </button>
          <button className="next" onClick={nextSlide}>
            &#10095;
          </button>
        </div>
      </section>

      <footer className="footer">
        <p>© 2024 소 경매 웹사이트. 모든 권리 보유.</p>
      </footer>
    </div>
  );
};

export default AuctionDetail;
