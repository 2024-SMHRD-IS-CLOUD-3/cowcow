import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import io from 'socket.io-client';
import logo from "../images/cowcowlogo.png"; // 로고 경로 조정 필요
import video from "../videos/시연영상(작업)-1.mp4";

const Header = ({ user, setUser, toggleTheme, isDarkMode }) => {
  const [showModal, setShowModal] = useState(false);
  const [broadCastTitle, setbroadCastTitle] = useState("");
  const [items, setItems] = useState([{ id: 1, entity: "", minValue: "" }]);
  const [userCows, setUserCows] = useState([]);
  const [userBarns, setUserBarns] = useState([]);
  const [selectedBarn, setSelectedBarn] = useState("");
  const [barnCows, setBarnCows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [showAlarmDropdown, setShowAlarmDropdown] = useState(false);
  const [alarms, setAlarms] = useState([]);
  const [videoVisible, setVideoVisible] = useState(false);

  const handleButtonClick = () => {
    setVideoVisible(!videoVisible); // 버튼 클릭 시 상태 토글
  };

  const handleLogout = () => {
    if (window.Kakao && window.Kakao.Auth) {
      window.Kakao.Auth.logout(() => console.log("카카오 로그아웃 완료"));
    }
    setUser(null);
    sessionStorage.removeItem("user");
    navigate("/");
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setItems([{ id: 1, entity: "", minValue: "" }]);
    setbroadCastTitle("");
  };

  useEffect(() => {
    const fetchAlarms = async () => {
      if (!user) return;
      try {
        const response = await fetch(`http://223.130.160.153:3001/alarms/${user.usrSeq}`);
        if (response.ok) {
          const data = await response.json();
          setAlarms(data);
        } else {
          console.error("Failed to fetch alarms");
        }
      } catch (error) {
        console.error("Error fetching alarms:", error);
      }
    };

    fetchAlarms();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const socket = io('http://223.130.160.153:3001/alrim');

    socket.emit('joinRoom', { usrSeq: user.usrSeq });

    socket.on('newAlarm', (alarm) => {
      setAlarms((prevAlarms) => [alarm, ...prevAlarms]);
      alert(`새로운 알림: ${alarm.alarmMsg}`);
    });

    return () => {
      socket.off('newAlarm');
      socket.disconnect();
    };
  }, [user]);

  const toggleAlarmDropdown = () => {
    setShowAlarmDropdown(!showAlarmDropdown);
  };

  useEffect(() => {
    if (!user) return;
    const fetchUserBarns = async () => {
      try {
        const response = await fetch(
          `http://223.130.160.153:3001/user-barns/user/${user.usrSeq}`
        );
        if (response.ok) {
          const data = await response.json();
          setUserBarns(data);
        } else {
          throw new Error("농가 목록을 불러오는 데 실패했습니다.");
        }
      } catch (error) {
        console.error("Error fetching barns:", error);
      }
    };
    fetchUserBarns();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const fetchUserCows = async () => {
      try {
        const response = await fetch(
          `http://223.130.160.153:3001/cows/user/${user.usrSeq}`
        );
        if (response.ok) {
          const data = await response.json();
          setUserCows(data);
        } else {
          throw new Error("소 목록을 불러오는 데 실패했습니다.");
        }
      } catch (error) {
        console.error("Error fetching cows:", error);
      }
    };
    fetchUserCows();
  }, [user]);

  const handleBarnChange = async (e) => {
    const barnId = e.target.value;
    setSelectedBarn(barnId);

    if (barnId) {
      try {
        const response = await fetch(
          `http://223.130.160.153:3001/cows/barn/${barnId}`
        );
        if (response.ok) {
          const data = await response.json();
          setBarnCows(data);
        } else {
          throw new Error("농가의 소 목록을 불러오는 데 실패했습니다.");
        }
      } catch (error) {
        console.error("Error fetching cows:", error);
      }
    } else {
      setBarnCows([]);
    }
  };

  const handleAddItem = () =>
    setItems([...items, { id: items.length + 1, entity: "", minValue: "" }]);
  const handleRemoveItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    } else {
      alert("최소 하나의 항목은 등록해야 합니다.");
    }
  };

  const handleInputChange = (id, field, value) => {
    const updatedItems = items.map((item) =>
      item.id === id
        ? {
            ...item,
            [field]: field === "minValue" ? Math.max(0, value) : value,
          }
        : item
    );
    setItems(updatedItems);
  };

  const handlebroadCastTitleChange = (e) => setbroadCastTitle(e.target.value);

  const handleBroadcastStart = async () => {
    if (!broadCastTitle.trim()) {
      alert("방송 이름을 입력해주세요.");
      return;
    }

    const selectedCows = items.filter((item) => item.entity && item.minValue);
    if (selectedCows.length === 0) {
      alert("소와 최저가를 모두 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const predictions = await Promise.all(
        selectedCows.map(async (cow) => {
          const cowData = userCows.find((c) => c.cowSeq === Number(cow.entity));
          const response = await fetch("http://223.130.160.153:8081/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              번호: cowData.cowNo,
              kpn: cowData.cowKpn,
              계대: cowData.cowFamily,
              중량: cowData.cowWeight,
              최저가: cow.minValue,
              성별_수: cowData.cowGdr === "수" ? 1 : 0,
              성별_암: cowData.cowGdr === "암" ? 1 : 0,
              성별_프: cowData.cowGdr === "프" ? 1 : 0,
              종류_혈통우: cowData.cowJagigubun === "혈통우" ? 1 : 0,
            }),
          });

          if (!response.ok) {
            throw new Error(`예측 실패: ${cowData.cowNo}`);
          }

          const result = await response.json();
          return { ...cow, predictPrice: result.predicted_price };
        })
      );

      const response = await fetch("http://223.130.160.153:3001/auctions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: broadCastTitle,
          usrSeq: user.usrSeq,
          usrBarnSeq: user.selectedBarn,
          cows: predictions.map((cow) => ({
            cowSeq: Number(cow.entity),
            minValue: Number(cow.minValue),
            predictPrice: cow.predictPrice,
          })),
        }),
      });

      if (response.ok) {
        alert(`"${broadCastTitle}" 방송이 시작되었습니다!`);
        setItems([{ id: 1, entity: "", minValue: "" }]);
        setbroadCastTitle("");
        handleCloseModal();
        navigate("/");
      } else {
        throw new Error("방송 시작에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error starting broadcast:", error);
      alert("서버에 문제가 발생했습니다. 나중에 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Escape") {
      setVideoVisible(false); // esc 키 누르면 영상 끄기
    }
  };

  useEffect(() => {
    if (videoVisible) {
      // 영상이 켜져 있을 때만 이벤트 리스너 추가
      window.addEventListener("keydown", handleKeyPress);
    } else {
      // 영상이 꺼져 있을 때 이벤트 리스너 제거
      window.removeEventListener("keydown", handleKeyPress);
    }

    // 클린업 함수로 이벤트 리스너 제거
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [videoVisible]);

  return (
    <>
      <header className="header">
        <Link to="/" className="logo-link">
          <h1 style={{ display: "inline" }}>
            <img src={logo} alt="logo" />
          </h1>
        </Link>
        
        {location.pathname === "/" && (
          <div className="search-bar">
            <input
              type="text"
              placeholder="경매 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        <nav className="nav-links">
          <Link to="/">홈</Link>
          {user ? (
            <>
              <a onClick={() => setShowAlarmDropdown(!showAlarmDropdown)}>알람</a>
              {showAlarmDropdown && (
                <div className="alarm-dropdown">
                  <h4>알림</h4>
                  {alarms.length === 0 ? (
                    <p className="no-alarms">새 알림이 없습니다.</p>
                  ) : (
                    alarms.map((alarm) => (
                      <div key={alarm.alarmSeq} className="alarm-item">
                        <p>{alarm.alarmMsg}</p>
                        <small>{new Date(alarm.alarmCrtDt).toLocaleString()}</small>
                      </div>
                    ))
                  )}
                </div>
              )}
              <a className="open-modal-button" onClick={handleOpenModal}>
                경매등록
              </a>
              <Link to="/myPage">마이페이지</Link>
              <Link to="/" onClick={handleLogout}>
                로그아웃
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">로그인</Link>
              <Link to="/signUp">회원가입</Link>
            </>
          )}
        </nav>

        <button onClick={handleButtonClick} className="theme-toggle-button-video">
          ❓
        </button>
        <button onClick={toggleTheme} className="theme-toggle-button">
          {isDarkMode ? '🌞' : '🌙'}
        </button>
      </header>

      {videoVisible && (
        <div className="modal-overlay">
          {/* X 버튼 */}
          <button className="close-button" onClick={() => setVideoVisible(false)}>
            X
          </button>
          <video width="900" controls autoPlay>
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
      </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">경매 등록</h2>

            <div className="form-group">
              <label>방송 이름</label>
              <input
                type="text"
                value={broadCastTitle}
                onChange={handlebroadCastTitleChange}
                placeholder="방송 이름을 입력하세요"
              />

              <label>농가 선택</label>
              <select value={selectedBarn} onChange={handleBarnChange}>
                <option value="">농가 선택</option>
                {userBarns.map((barn) => (
                  <option key={barn.usrBarnSeq} value={barn.usrBarnSeq}>
                    {barn.usrBarnName}
                  </option>
                ))}
              </select>

              {items.map((item) => (
                <div key={item.id} className="form-group row">
                  <div className="input-container">
                    <label>개체 번호</label>
                    <select
                      value={item.entity}
                      onChange={(e) =>
                        handleInputChange(item.id, "entity", e.target.value)
                      }
                    >
                      <option value="">개체 선택</option>
                      {barnCows.map((cow) => (
                        <option key={cow.cowSeq} value={cow.cowSeq}>
                          {cow.cowNo} ({cow.cowGdr})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="input-container">
                    <label>최저가</label>
                    <input
                      type="number"
                      value={item.minValue}
                      onChange={(e) =>
                        handleInputChange(item.id, "minValue", e.target.value)
                      }
                      min="0"
                      placeholder="최소가를 입력하세요"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="button-group">
              <button className="add-button" onClick={handleAddItem}>
                추가
              </button>
              <button
                onClick={() => handleRemoveItem(items[items.length - 1].id)}
                className="remove-button"
                disabled={items.length === 1}
              >
                삭제
              </button>
            </div>

            <div className="modal-footer">
              <button className="close-button" onClick={handleCloseModal}>
                닫기
              </button>
              <button
                onClick={handleBroadcastStart}
                className="broadcast-button"
                disabled={isLoading}
              >
                {isLoading ? "처리 중..." : "방송시작"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
