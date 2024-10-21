import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CowPage.css";
import logo from "../images/cowcowlogo.png";

const CowPage = ({ user, setUser }) => {
  const [formData, setFormData] = useState({
    cowId: "",
    ageInMonths: "",
    seller: "",
    region: "",
    kpn: "",
    parity: "",
    gender: "",
    selfClassification: "",
    motherClassification: "",
    note: "",
    images: [],
  });

  const classifications = ["예비", "기초", "혈통", "고등", "육종우"];
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      const newImages = Array.from(files);
      if (formData.images.length + newImages.length > 4) {
        alert("최대 4개의 이미지만 업로드할 수 있습니다.");
        return;
      }
      setFormData({ ...formData, images: [...formData.images, ...newImages] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // 서버로 데이터 전송 처리
  };

  const handleLogout = () => {
    setUser(null); // 로그아웃 처리
    localStorage.removeItem("user");
    navigate("/"); // 메인 페이지로 리다이렉트
  };

  return (
    <div className="layout">
      <div className="header">
        <Link to="/" className="logo-link">
          <h1 style={{ display: "inline" }}>
            <img src={logo}></img>
          </h1>
        </Link>
        <nav className="nav-links">
            <Link to="/">홈</Link> {/* a 태그를 Link로 변경 */}
            <Link to="#">출장우 조회</Link> {/* a 태그를 Link로 변경 */}
            <Link to="/myPage" className="active">마이페이지</Link> {/* a 태그를 Link로 변경 */}
            <Link to="/" onClick={handleLogout}>로그아웃</Link> {/* 버튼을 Link로 변경 */}
        </nav>
      </div>
      <div className="content-container">
        <aside className="sidebar">
        <ul>
            <li><Link to="/myPage">개인정보 변경</Link></li> {/* a 태그를 Link로 변경 */}
            <li><Link to="/transactionHistory">거래 내역</Link></li> {/* a 태그를 Link로 변경 */}
            <li><Link to="/cowPage" className="active">경매 등록</Link></li> {/* a 태그를 Link로 변경 */}
            <li><Link to="/deleteAccount">회원 탈퇴</Link></li> {/* a 태그를 Link로 변경 */}
        </ul>
        </aside>
        <div className="content-center">
          <form className="registration-form" onSubmit={handleSubmit}>
            <label htmlFor="cowId">개체번호</label>
            <input
              type="text"
              id="cowId"
              name="cowId"
              value={formData.cowId}
              onChange={handleChange}
              required
            />

            <label htmlFor="ageInMonths">개월령</label>
            <input
              type="number"
              id="ageInMonths"
              name="ageInMonths"
              min="0"
              value={formData.ageInMonths}
              onChange={handleChange}
              required
            />

            <label htmlFor="seller">출하주</label>
            <input
              type="text"
              id="seller"
              name="seller"
              value={formData.seller}
              onChange={handleChange}
              required
            />

            <label htmlFor="region">지역</label>
            <input
              type="text"
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              required
            />

            <label htmlFor="kpn">KPN</label>
            <input
              type="text"
              id="kpn"
              name="kpn"
              value={formData.kpn}
              onChange={handleChange}
            />

            <label htmlFor="parity">산차</label>
            <input
              type="number"
              id="parity"
              name="parity"
              value={formData.parity}
              onChange={handleChange}
            />

            <label htmlFor="gender">성별</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">선택</option>
              <option value="male">수컷</option>
              <option value="female">암컷</option>
            </select>

            <label htmlFor="selfClassification">자기구분</label>
            <select
              id="selfClassification"
              name="selfClassification"
              value={formData.selfClassification}
              onChange={handleChange}
            >
              <option value="">선택</option>
              {classifications.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <label htmlFor="motherClassification">어미구분</label>
            <select
              id="motherClassification"
              name="motherClassification"
              value={formData.motherClassification}
              onChange={handleChange}
            >
              <option value="">선택</option>
              {classifications.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <label htmlFor="note">비고</label>
            <textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={handleChange}
            />

            <label htmlFor="images">이미지 첨부 (정면/후면/좌/우)</label>
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
            </div>
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
