// Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../images/cowcowlogo.png"; // 로고 경로 조정 필요

const Header = ({ user, setUser }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
        navigate("/");
    };

  return (
    <header className="header">
      <Link to="/" className="logo-link">
        <h1 style={{ display: "inline" }}>
          <img src={logo} alt="logo" />
        </h1>
      </Link>
      <nav className="nav-links">
        <Link to="/">홈</Link>
        {user ? (
          <>
            <Link to="/auctionRegister">경매등록</Link>
            <Link to="/myPage">마이페이지</Link>
            <Link to="/" onClick={handleLogout}>로그아웃</Link>
          </>
        ) : (
          <>
            <Link to="/login">로그인</Link>
            <Link to="/signUp">회원가입</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
