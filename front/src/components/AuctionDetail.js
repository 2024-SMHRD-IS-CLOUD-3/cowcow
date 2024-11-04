import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./AuctionDetail.css";

const AuctionDetail = ({ user, setUser, isDarkMode }) => {
  const updateTimer = () => {
    const now = new Date();
    const distance = endTime - now;

    if (distance <= 0) {
      setTimeRemaining("경매 종료");
      clearInterval(timerInterval);

      // handleAuctionEnd();
      return;
    }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    setTimeRemaining(`${days}일 ${hours}시간 ${minutes}분 ${seconds}초`);
  };
  
  // isDarkMode prop 추가
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [acows, setAcows] = useState([]);
  const [endTime, setEndTime] = useState();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [bidAmount, setBidAmount] = useState(""); // 입찰 금액 상태 추가
  const [highestBid, setHighestBid] = useState(null); // 현재 최고 입찰가 상태 추가
  const [isLoadingBid, setIsLoadingBid] = useState(false); // 로딩 상태 추가
  const [timeRemaining, setTimeRemaining] = useState(null);
  const timerInterval = setInterval(updateTimer, 1000);
  // const interval = setInterval(fetchAuctionDetail, 1000);
  const videoRef = useRef(null); // 비디오 요소 참조
  const navigate = useNavigate();

  const imgSlides = [
    { src: "/images/소1.jfif", alt: "경매 소 이미지 1" },
    { src: "/images/소2.jfif", alt: "경매 소 이미지 2" },
    { src: "/images/소3.jfif", alt: "경매 소 이미지 3" },
    { src: "/images/소4.jfif", alt: "경매 소 이미지 4" },
  ];

  const showSlide = (index) => {
    const newIndex = (index + acows.length) % acows.length;
    setCurrentSlide(newIndex);
  };

  const nextSlide = () => showSlide(currentSlide + 1);
  const prevSlide = () => showSlide(currentSlide - 1);

  const fetchAuctionDetail = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/auctions/${id}`
      );
      if (!response.ok) {
        throw new Error("경매 정보를 가져오는 데 실패했습니다.");
      }
      const auctionData = await response.json();
      setAuction(auctionData);
      setAcows(auctionData.auctionCows);
      setEndTime(new Date(auctionData.aucEndDt));
    } catch (error) {
      console.error("Error fetching auction detail:", error);
    }
  };



  useEffect(() => {
    fetchAuctionDetail();
  }, [id]);


  useEffect(() => {
    if (!endTime) return;

    const timerInterval = setInterval(updateTimer, 1000);

    // 타이머 정리 함수
    return () => clearInterval(timerInterval);
  }, [endTime]);


  const fetchHighestBid = async (acowSeq) => {
    setIsLoadingBid(true);
    try {
      const response = await fetch(
        `http://localhost:3001/auction-bids/highest/${acowSeq}`
      );
      if (!response.ok) {
        throw new Error("최고 입찰가를 가져오는 데 실패했습니다.");
      }
      const bidData = await response.json();
      setHighestBid(bidData);
    } catch (error) {
      console.error("Error fetching highest bid:", error);
      setHighestBid(null);
    } finally {
      setIsLoadingBid(false);
    }
  };

  useEffect(() => {
    if (!acows[currentSlide]) return;

    // 최고 입찰가 1초마다 업데이트
    const highestBidInterval = setInterval(() => {
      fetchHighestBid(acows[currentSlide].acowSeq);
    }, 1000);

    return () => clearInterval(highestBidInterval);
  }, [currentSlide, acows]);


  // // 경매 상태를 '방송종료'로 변경하는 함수
  // const handleAuctionEnd = async () => {
  //   try {
  //     const response = await fetch(`http://localhost:3001/auctions/${id}/status`, {
  //       method: "PATCH",
  //       headers: { 
  //         "Content-Type": "application/json" 
  //       },
  //       body: JSON.stringify({ aucStatus: "방송종료" }),
  //     });
  //     if (!response.ok) throw new Error("경매 종료 상태 변경 실패");

  //     alert("경매가 종료되었습니다.");
  //   } catch (error) {
  //     console.error("Error updating auction status:", error);
  //   }
  // };



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
    } else if (bidAmount <= acows[currentSlide].acowBottomPrice) {
      alert("입찰 금액은 최저가보다 높아야 합니다.");
      return;
    } else if (highestBid && bidAmount < highestBid.bidAmt) {
      alert("입찰 금액은 현재 최고입찰가보다 높아야 합니다.");
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
          acowSeq: acows[currentSlide].acowSeq,
          bidAcc: user.usrSeq,
          bidAmt: parseInt(bidAmount, 10),
          bidDt: new Date(),
        }),
      });

      if (!response.ok) {
        throw new Error("입찰에 실패했습니다.");
      }

      alert("입찰에 성공했습니다!");
      setBidAmount("");
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
    console.log("AuctionDetail Page : ");
    console.log(acows[currentSlide].acowSeq);
    console.log(highestBid.bidAcc);
    console.log(highestBid.bidAmt);

    try {
      const response = await fetch(
        `http://localhost:3001/auction-cows/${acows[currentSlide].acowSeq}/win`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            acowWinnerSeq: highestBid.bidAcc,
            acowFinalBid: highestBid.bidAmt,
          }),
        }
      );

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

  const slides =
    acows?.map((acow) => (
      <table className="details-table" key={acow.acowSeq}>
        <tbody>
          <tr>
            <th>방송 제목</th>
            <td>{auction?.aucBroadcastTitle || "정보 없음"}</td>
          </tr>
          <tr>
            <th>개체 번호</th>
            <td>{acow?.cow?.cowNo || "정보 없음"}</td>
          </tr>
          <tr>
            <th>출하주</th>
            <td>{auction?.user?.usrNm || "정보 없음"}</td>
          </tr>
          <tr>
            <th>농장 이름</th>
            <td>{acow?.cow?.userBarn?.usrBarnName || "정보 없음"}</td>
          </tr>
          <tr>
            <th>성별</th>
            <td>{acow?.cow?.cowGdr || "정보 없음"}</td>
          </tr>
          <tr>
            <th>최저가</th>
            <td>{acow?.acowBottomPrice || 0}만원</td>
          </tr>
          <tr>
            <th>현재 최고 입찰가(입찰자)</th>
            <td>
              {highestBid
                ? `${highestBid.bidAmt}만원(${
                    highestBid.user?.usrNm || "알 수 없음"
                  })`
                : "정보 없음"}
            </td>
          </tr>
          <tr>
            <th>
              <h1>경매 상태</h1>
            </th>
            <td>
              <h1
                className={
                  acows[currentSlide]?.acowStatus === "진행중"
                    ? "state-progressing"
                    : "state-won"
                }
              >
                {acows[currentSlide]?.acowStatus || "정보 없음"}
              </h1>
            </td>
          </tr>
        </tbody>
      </table>
    )) || [];

  return (
    <div className="auction-detail-container">
      <section className="auction-detail">
        <div className="expected-price-container">
          <div className="expected-price">
            예상가: {acows[currentSlide]?.acowPredictPrice || 0}만원
          </div>
          <div className="expected-price">
            {timeRemaining ? (
              <p>종료까지 {timeRemaining}</p>
            ) : (
              <p>시간 로딩 중...</p>
            )}
          </div>
        </div>
        <div className="auction-content">
          <div className="video-container">
            <iframe
              src="http://localhost:5000/video_feed"
              title="RTSP Video Stream"
            ></iframe>
          </div>

          <div className="auction-details">
            <div className="details-table">
              <div className="slider">
                <div key={currentSlide} className="slide">
                  {slides[currentSlide]}
                </div>
              </div>
            </div>

            <div className="bid-section-inline">
              {!user ? (
                <>
                  <input
                    type="number"
                    placeholder={
                      acows[currentSlide]?.acowStatus === "낙찰"
                        ? "낙찰 완료된 상품입니다"
                        : "입찰 금액 입력"
                    }
                    className="bid-input"
                    disabled={acows[currentSlide]?.acowStatus === "낙찰"}
                  />
                  <Link to="/login">
                    <button
                      className={`btn primary ${
                        acows[currentSlide]?.acowStatus === "낙찰"
                          ? "disabled"
                          : ""
                      }`}
                      disabled={acows[currentSlide]?.acowStatus === "낙찰"}
                    >
                      {acows[currentSlide]?.acowStatus === "낙찰"
                        ? "입찰 불가"
                        : "입찰하기"}
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  {auction.usrSeq === user.usrSeq ? (
                    <button
                      className={`btn primary ${
                        acows[currentSlide]?.acowStatus === "낙찰"
                          ? "disabled"
                          : ""
                      }`}
                      onClick={handleWinningBid}
                      disabled={
                        !highestBid ||
                        acows[currentSlide]?.acowStatus === "낙찰"
                      }
                    >
                      {acows[currentSlide]?.acowStatus === "낙찰"
                        ? "낙찰 완료"
                        : "낙찰하기"}
                    </button>
                  ) : (
                    <>
                      <input
                        type="number"
                        placeholder={
                          acows[currentSlide]?.acowStatus === "낙찰"
                            ? "낙찰 완료된 상품입니다"
                            : "입찰 금액 입력"
                        }
                        className="bid-input"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        disabled={acows[currentSlide]?.acowStatus === "낙찰"}
                      />
                      <button
                        className={`btn primary ${
                          acows[currentSlide]?.acowStatus === "낙찰"
                            ? "disabled"
                            : ""
                        }`}
                        onClick={handleBidSubmit}
                        disabled={acows[currentSlide]?.acowStatus === "낙찰"}
                      >
                        {acows[currentSlide]?.acowStatus === "낙찰"
                          ? "입찰 불가"
                          : "입찰하기"}
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

    </div>
  );
};

export default AuctionDetail;
