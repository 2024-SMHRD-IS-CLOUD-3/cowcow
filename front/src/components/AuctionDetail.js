// AuctionDetail.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"; // useParams 추가
import "./AuctionDetail.css";
import logo from "../images/cowcowlogo.png";

const AuctionDetail = ({ user, setUser }) => {
  const { id } = useParams(); // URL에서 경매 ID 가져오기
  const [auction, setAuction] = useState(null); // 경매 정보를 저장할 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate

  useEffect(() => {
    const fetchAuctionDetail = async () => {
      try {
        const response = await fetch(`http://localhost:3001/auctions/${id}`); // 경매 세부정보 API 호출
        if (!response.ok) {
          throw new Error("경매 정보를 가져오는 데 실패했습니다.");
        }
        const auctionData = await response.json();
        setAuction(auctionData); // 상태 업데이트
      } catch (error) {
        console.error("Error fetching auction detail:", error);
      }
    };

    fetchAuctionDetail();
  }, [id]);

  const handleLogout = () => {
    setUser(null); // 로그아웃 처리
    localStorage.removeItem("user");
    navigate("/"); // 메인 페이지로 리다이렉트
  };

  return (
    <div className="auction-detail-container">
      <header className="header">
        <div className="logo">
          <Link to="/" className="logo-link">
            <h1 style={{ display: "inline" }}><img src={logo} alt="logo"></img></h1>
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

      {auction ? (
        <section className="auction-detail">
          <div className="auction-content">
            <h2>{auction.aucBroadcastTitle}</h2>
            <p>작성자: {auction.user?.usrNm}</p> {/* 작성자 정보 표시 */}
            <table className="details-table">
              <tbody>
                <tr>
                  <th>소 이름</th>
                  <td>{auction.cow?.cowNo}</td> {/* 소 번호 */}
                </tr>
                <tr>
                  <th>예상 낙찰가</th>
                  <td>{auction.aucFinalBid ? `${auction.aucFinalBid}원` : "정보 없음"}</td>
                </tr>
                <tr>
                  <th>경매 상태</th>
                  <td>{auction.aucStatus}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <p>경매 정보를 불러오는 중...</p>
      )}
      
      <footer className="footer">
        <p>© 2024 소 경매 웹사이트. 모든 권리 보유.</p>
      </footer>
    </div>
  );
};

export default AuctionDetail;
