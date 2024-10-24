import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './AuctionRegister.css';

const AuctionRegister = ({user, setUser}) => {
  const [showModal, setShowModal] = useState(false);
  const [broadCastTitle, setbroadCastTitle] = useState('');
  const [items, setItems] = useState([{ id: 1, entity: '', minValue: '' }]);
  const [userCows, setUserCows] = useState([]); // 유저의 소 목록
  const navigate = useNavigate();


  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

    // 페이지 새로고침 시 유저 정보 체크
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")); // 유저 정보 복구
    if (storedUser) {
        setUser(storedUser);
    } else {
        navigate("/login"); // 유저 정보가 없으면 로그인 페이지로 이동
    }
  }, [setUser, navigate]);

  // 유저의 소 목록 불러오기
  useEffect(() => {
    console.log(user.usrSeq);
    if (user?.usrSeq) {
      const fetchUserCows = async () => {
        try {
          const response = await fetch(`http://localhost:3001/cows/user/${user.usrSeq}`);
          if (response.ok) {
            const data = await response.json();
            setUserCows(data); // 소 목록 설정
          } else {
            throw new Error('소 목록을 불러오는 데 실패했습니다.');
          }
        } catch (error) {
          console.error('Error fetching cows:', error);
        }
      };
      fetchUserCows();
    }
  }, [user]);
  

  const handleAddItem = () => {
    setItems([...items, { id: items.length + 1, entity: '', minValue: '' }]);
  };

  const handleRemoveItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    } else {
      alert('최소 하나의 항목은 등록해야 합니다.');
    }
  };

  const handleInputChange = (id, field, value) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setItems(updatedItems);
  };

  const handlebroadCastTitleChange = (e) => setbroadCastTitle(e.target.value);

  const handleBroadcastStart = async () => {
    if (!broadCastTitle) {
      alert('방송 이름을 입력해주세요');
      return;
    }
  
    const selectedCows = items.filter((item) => item.entity !== '');
    if (selectedCows.length === 0) {
      alert('소를 선택해주세요');
      return;
    }
    
    console.log("selectedCows: ", selectedCows);
    try {
      const response = await fetch('http://localhost:3001/auctions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: broadCastTitle,
          usrSeq: user.usrSeq, // 사용자 시퀀스
          usrBarnSeq: user.selectedBarn, // 선택한 축사 시퀀스
          cows: selectedCows, // 선택한 소 정보
        }),
      });
  
      if (response.ok) {
        alert(`"${broadCastTitle}" 방송이 시작되었습니다!`);
        handleCloseModal(); // 모달 닫기
        navigate("/");
      } else {
        throw new Error('방송 시작에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error starting broadcast:', error);
    }
  };
  

  return (
    <>
      <button className="open-modal-button" onClick={handleOpenModal}>
        경매등록
      </button>

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
            </div>

            {items.map((item) => (
              <div key={item.id} className="form-group row">
                <div className="input-container">
                  <label>개체 번호</label>
                  <select
                    value={item.entity}
                    onChange={(e) =>
                      handleInputChange(item.id, 'entity', e.target.value)
                    }
                  >
                    <option value="">개체 선택</option>
                    {userCows.map((cow) => (
                      <option key={cow.cowSeq} value={cow.cowSeq}>
                        {cow.cowNo} ({cow.cowGdr === 'male' ? '수컷' : '암컷'})
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
                      handleInputChange(item.id, 'minValue', e.target.value)
                    }
                    min= "0"
                    placeholder="최소가를 입력하세요"
                  />
                </div>
              </div>
            ))}

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
              <button onClick={handleBroadcastStart} className="broadcast-button">
                방송시작
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AuctionRegister;
