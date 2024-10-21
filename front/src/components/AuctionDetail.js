import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./AuctionDetail.css";
import logo from "../images/cowcowlogo.png";

const AuctionDetail = ({ user, setUser }) => {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRef = useRef(null); // 비디오 요소 참조
  const navigate = useNavigate();

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

  const nextSlide = () => showSlide(currentSlide + 1);
  const prevSlide = () => showSlide(currentSlide - 1);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    const fetchAuctionDetail = async () => {
      try {
        const response = await fetch(`http://localhost:3001/auctions/${id}`);
        if (!response.ok) {
          throw new Error("경매 정보를 가져오는 데 실패했습니다.");
        }
        const auctionData = await response.json();
        setAuction(auctionData);
      } catch (error) {
        console.error("Error fetching auction detail:", error);
      }
    };

    fetchAuctionDetail();
  }, [id]);

  useEffect(() => {
    let stream;

    const startVideoStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        stream = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("웹캠 스트림을 불러올 수 없습니다:", error);
      }
    };

    startVideoStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  if (!auction) return <p>경매 정보를 불러오는 중...</p>;

  return (
    <div className="auction-detail-container">
      <header className="header">
        <div className="logo">
          <Link to="/" className="logo-link">
            <h1 style={{ display: "inline" }}>
              <img src={logo} alt="logo" />
            </h1>
          </Link>
        </div>
        <nav className="nav-links">
          <Link to="/">홈</Link>
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
            <video ref={videoRef} controls autoPlay muted>
              브라우저가 동영상을 지원하지 않습니다.
            </video>
          </div>

          <div className="auction-details">
            <table className="details-table">
              <tbody>
                <tr>
                  <th>방송 제목</th>
                  <td>{auction?.aucBroadcastTitle || "정보 없음"}</td>
                </tr>
                <tr>
                  <th>개체 번호</th>
                  <td>{auction?.cow?.cowNo || "정보 없음"}</td>
                </tr>
                <tr>
                  <th>출하주</th>
                  <td>{auction?.user?.usrNm || "정보 없음"}</td>
                </tr>
                <tr>
                  <th>성별</th>
                  <td>암소</td>
                </tr>
                <tr>
                  <th>경매 상태</th>
                  <td>{auction?.aucStatus || "정보 없음"}</td>
                </tr>
                <tr>
                  <th>현재 최고 입찰가</th>
                  <td>{auction?.aucFinalBid?.toLocaleString() || "정보 없음"}원</td>
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
