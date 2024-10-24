import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./AuctionDetail.css";
import logo from "../images/cowcowlogo.png";

const AuctionDetail = ({ user, setUser }) => {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [acows, setAcows] = useState([]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [bidAmount, setBidAmount] = useState(""); // 입찰 금액 상태 추가
  const [highestBid, setHighestBid] = useState(null); // 현재 최고 입찰가 상태 추가
  const videoRef = useRef(null); // 비디오 요소 참조
  const navigate = useNavigate();

  const imgSlides = [
    { src: "/images/소1.jfif", alt: "경매 소 이미지 1" },
    { src: "/images/소2.jfif", alt: "경매 소 이미지 2" },
    { src: "/images/소3.jfif", alt: "경매 소 이미지 3" },
    { src: "/images/소4.jfif", alt: "경매 소 이미지 4" },
  ];

  // const showSlide = (index) => {
  //   if (index >= slides.length) setCurrentSlide(0);
  //   else if (index < 0) setCurrentSlide(slides.length - 1);
  //   else setCurrentSlide(index);
  // };

  // const nextSlide = () => showSlide(currentSlide + 1);
  // const prevSlide = () => showSlide(currentSlide - 1);

  const nextSlide = () => {
    if (auction) {
      acows.map((cow, index) =>(console.log(cow)));

      setCurrentSlide((prevSlide) => (prevSlide + 1) % auction.auctionCows.length);
    }
  };

  const prevSlide = () => {
    if (auction) {
      setCurrentSlide((prevSlide) =>
        prevSlide === 0 ? auction.length - 1 : prevSlide - 1
      );
    }
  };

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
        setAcows(auctionData.auctionCows);
      } catch (error) {
        console.error("Error fetching auction detail:", error);
      }
    };

    fetchAuctionDetail();
  }, [id]);

  // 현재 최고 입찰가를 주기적으로 업데이트하는 useEffect
  // useEffect(() => {
  //   const fetchHighestBid = async () => {
  //     try {
  //       const response = await fetch(`http://localhost:3001/auction-bids/highest/${id}`);
  //       if (!response.ok) {
  //         throw new Error("현재 최고 입찰가를 가져오는 데 실패했습니다.");
  //       }
  //       const highestBid = await response.json();
  //       setHighestBid(highestBid);
  //     } catch (error) {
  //       console.error("Error fetching highest bid:", error);
  //     }
  //   };
  //       // 주기적으로 최고 입찰가 업데이트 (예: 5초마다)
  //     const intervalId = setInterval(fetchHighestBid, 5000);

  //       // 컴포넌트 언마운트 시 정리
  //     return () => clearInterval(intervalId);
  // }, [id]);

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

  const handleBidSubmit = async () => {
    if (!bidAmount) {
      alert("입찰 금액을 입력해 주세요.");
      return;
    } else if (bidAmount < auction.aucBottomPrice) {
      alert("입찰 금액은 최저가보다 높아야 합니다.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/auction-bids`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          aucSeq: auction.aucSeq,
          bidAcc: user.usrSeq,
          bidAmt: parseInt(bidAmount, 10),
        }),
      });

      if (!response.ok) {
        throw new Error("입찰에 실패했습니다.");
      }

      alert("입찰에 성공했습니다!");
      setBidAmount(""); // 입력한 금액 초기화
    } catch (error) {
      console.error("Error during bid submission:", error);
      alert("입찰에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  const handleWinningBid = async () => {
    if (!highestBid) {
      alert("낙찰할 입찰가가 없습니다.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3001/auctions/${auction.aucSeq}/win`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          winningUserSeq: highestBid.bidAcc,
          finalBidAmount: highestBid.bidAmt,
        }),
      });
  
      if (!response.ok) {
        throw new Error("낙찰 처리에 실패했습니다.");
      }
  
      alert("낙찰이 성공적으로 처리되었습니다!");
      navigate("/");
    } catch (error) {
      console.error("Error during winning bid submission:", error);
      alert("낙찰 처리에 실패했습니다. 다시 시도해 주세요.");
    }
  };
  


  if (!auction) return <p>경매 정보를 불러오는 중...</p>;
  
  // Auction Detail 슬라이드 데이터
  const slides = acows?.map((cow, index) =>
    (
      <table className="details-table">
        <tbody>
          <tr>
            <th>방송 제목</th>
            <td>{auction?.aucBroadcastTitle || "정보 없음"}</td>
          </tr>
          <tr>
            <th>개체 번호</th>
            <td>{cow.acowSeq || "정보 없음"}</td>
          </tr>
          <tr>
            <th>출하주</th>
            <td>{auction?.user?.usrNm || "정보 없음"}</td>
          </tr>
          <tr>
            <th>성별</th>
            <td>acows이용해서 cows조인</td>
          </tr>
          <tr>
            <th>경매 상태</th>
            <td>{cow?.acowStatus || "정보 없음"}</td>
          </tr>
          <tr>
            <th>예상가</th>
            <td>{cow?.acowPredictPrice || 0} 원</td>
          </tr>
          <tr>
            <th>최저가</th>
            <td>{cow?.acowBottomPrice || 0 } 원</td>
          </tr>
          <tr>
            <th>현재 최고 입찰가</th>
            <td>{highestBid !== null ? `${highestBid.bidAmt}원` : "정보 없음"}</td>
          </tr>
        </tbody>
      </table>
    )) || [];



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
          <Link to="/auctionRegister">경매등록</Link>
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
            <div className="details-table">
              <div className="slider">
                <div key={currentSlide} className="slide">
                  {slides[currentSlide]}
                </div>
              </div>
              {/* <button className="prev" onClick={prevSlide}>
                &#10094;
              </button>
              <button className="next" onClick={nextSlide}>
                &#10095;
              </button> */}
            </div>

              <div className="bid-section-inline">
                {!user ? (
                  <>
                    <input
                      type="number"
                      placeholder="입찰 금액 입력"
                      className="bid-input"
                    />
                    <Link to="/login">
                      <button className="btn primary">입찰하기</button>
                    </Link>
                  </>
                ) : (
                  <>
                    {auction.usrSeq === user.usrSeq ? (
                      <button
                        className="btn primary"
                        onClick={handleWinningBid}
                        disabled={ !highestBid }
                      >
                        낙찰하기
                      </button>
                    ) : (
                      <>
                        <input
                          type="number"
                          placeholder="입찰 금액 입력"
                          className="bid-input"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                        />
                        <button className="btn primary" onClick={handleBidSubmit}>
                          입찰하기
                        </button>
                      </>
                    )}
                  </>
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
