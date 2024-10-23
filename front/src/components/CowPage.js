import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CowPage.css";
import logo from "../images/cowcowlogo.png";

const CowPage = ({ user, setUser }) => {
  const [formData, setFormData] = useState({
    cowNo: "",
    cowBirDt: "",
    usrSeq: user.usrSeq, // 로그인한 사용자 ID
    cowRegion: "",
    cowKpn: "",
    cowPrt: "",
    cowGdr: "",
    cowJagigubun: "",
    cowEomigubun: "",
    notes: "",
  });

  const classifications = ["예비", "기초", "혈통", "고등", "육종우"];
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRemoveImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);

    try {
      const response = await fetch("http://localhost:3001/cows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("소 등록이 완료되었습니다.");
        setFormData({
          cowNo: "",
          cowBirDt: "",
          usrSeq: user.usrSeq, // 로그인한 사용자 ID 그대로 유지
          cowRegion: "",
          cowKpn: "",
          cowPrt: "",
          cowGdr: "",
          cowJagigubun: "",
          cowEomigubun: "",
          notes: "",
        }); // 초기 상태로 되돌리기
        navigate("/cowPage");
      } else {
        throw new Error("소 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error submitting cow data:", error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="layout">
      <div className="header">
        <Link to="/" className="logo-link">
          <h1 style={{ display: "inline" }}>
            <img src={logo} alt="logo" />
          </h1>
        </Link>
        <nav className="nav-links">
          <Link to="/">홈</Link>
          <Link to="/auctionRegister">경매등록</Link>
          <Link to="/myPage" className="active">마이페이지</Link>
          <Link to="/" onClick={handleLogout}>로그아웃</Link>
        </nav>
      </div>

      <div className="content-container">
        <aside className="sidebar">
          <ul>
            <li><Link to="/myPage">개인정보 변경</Link></li>
            <li><Link to="/cowPage" className="active">소 등록</Link></li>
            <li><Link to="/transactionHistory">거래 내역</Link></li>
            <li><Link to="/deleteAccount">회원 탈퇴</Link></li>
          </ul>
        </aside>

        <div className="content-center">
          <form className="registration-form" onSubmit={handleSubmit}>
            <label htmlFor="cowNo">개체번호</label>
            <input
              type="text"
              id="cowNo"
              name="cowNo"
              value={formData.cowNo}
              onChange={handleChange}
              required
            />

            <label htmlFor="cowBirDt">생년월일</label>
            <input
              type="date"
              id="cowBirDt"
              name="cowBirDt"
              value={formData.cowBirDt}
              onChange={handleChange}
              required
            />

            <label htmlFor="usrSeq">출하주</label>
            <input
              type="text"
              value={user.usrNm}
              readOnly
            />

            <label htmlFor="cowRegion">지역</label>
            <input
              type="text"
              id="cowRegion"
              name="cowRegion"
              value={formData.cowRegion}
              onChange={handleChange}
              required
            />

            <label htmlFor="cowKpn">KPN</label>
            <input
              type="text"
              id="cowKpn"
              name="cowKpn"
              value={formData.cowKpn}
              onChange={handleChange}
            />

            <label htmlFor="cowPrt">산차</label>
            <input
              type="number"
              id="cowPrt"
              name="cowPrt"
              value={formData.cowPrt}
              onChange={handleChange}
            />

            <label htmlFor="cowGdr">성별</label>
            <select
              id="cowGdr"
              name="cowGdr"
              value={formData.cowGdr}
              onChange={handleChange}
              required
            >
              <option value="">선택</option>
              <option value="male">수컷</option>
              <option value="female">암컷</option>
            </select>

            <label htmlFor="cowJagigubun">자기구분</label>
            <select
              id="cowJagigubun"
              name="cowJagigubun"
              value={formData.cowJagigubun}
              onChange={handleChange}
            >
              <option value="">선택</option>
              {classifications.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <label htmlFor="cowEomigubun">어미구분</label>
            <select
              id="cowEomigubun"
              name="cowEomigubun"
              value={formData.cowEomigubun}
              onChange={handleChange}
            >
              <option value="">선택</option>
              {classifications.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <label htmlFor="notes">비고</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />

            {/* <label htmlFor="images">이미지 첨부 (최대 4개)</label>
            <input
              type="file"
              id="images"
              name="images"
              onChange={handleChange}
              accept="image/*"
              multiple
            />

            <div className="image-preview">
              {formData.images.map((image, index) => (
                <div key={index} className="image-container">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`preview-${index}`}
                  />
                  <div
                    className="remove-button"
                    onClick={() => handleRemoveImage(index)}
                  />
                </div>
              ))}
            </div> */}

            <button type="submit" className="submit-button">
              등록
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CowPage;
