import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AuctionRegister.css';

const AuctionRegister = ({ user, setUser }) => {
  const [showModal, setShowModal] = useState(false);
  const [broadCastTitle, setbroadCastTitle] = useState('');
  const [items, setItems] = useState([{ id: 1, entity: '', minValue: '' }]);
  const [userCows, setUserCows] = useState([]); // 유저의 소 목록
  const navigate = useNavigate();

  // 모달 열기/닫기
  const handleOpenModal = () => setShowModal(true);
  
  const handleCloseModal = () => {
    setShowModal(false);
    setItems([{ id: 1, entity: '', minValue: '' }]); // 폼 초기화
    setbroadCastTitle(''); // 방송 이름 초기화
  };

  // 유저 정보 체크 (페이지 새로고침 시)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user')); // 유저 정보 복구
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate('/login'); // 유저 정보가 없으면 로그인 페이지로 이동
    }
  }, [setUser, navigate]);

  // 유저의 소 목록 불러오기
  useEffect(() => {
    if (!user) return;

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
  }, [user]);

  // 항목 추가 및 삭제
  const handleAddItem = () => setItems([...items, { id: items.length + 1, entity: '', minValue: '' }]);

  const handleRemoveItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    } else {
      alert('최소 하나의 항목은 등록해야 합니다.');
    }
  };

  // 입력값 변경 처리
  const handleInputChange = (id, field, value) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, [field]: field === 'minValue' ? Math.max(0, value) : value } : item
    );
    setItems(updatedItems);
  };

  const handlebroadCastTitleChange = (e) => setbroadCastTitle(e.target.value);

  // 경매 방송 시작
  const handleBroadcastStart = async () => {
    if (!broadCastTitle.trim()) {
      alert('방송 이름을 입력해주세요.');
      return;
    }

    const selectedCows = items.filter((item) => item.entity && item.minValue);
    if (selectedCows.length === 0) {
      alert('소와 최저가를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/auctions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: broadCastTitle,
          usrSeq: user.usrSeq,
          usrBarnSeq: user.selectedBarn,
          cows: selectedCows.map((cow) => ({
            cowSeq: Number(cow.entity),  // cowSeq가 누락되지 않도록 숫자로 변환
            minValue: Number(cow.minValue),
          })),
        }),
      });

      if (response.ok) {
        alert(`"${broadCastTitle}" 방송이 시작되었습니다!`);
        setItems([{ id: 1, entity: '', minValue: '' }]); // 폼 초기화
        setbroadCastTitle(''); // 방송 이름 초기화
        handleCloseModal(); // 모달 닫기
        navigate('/');
      } else {
        throw new Error('방송 시작에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error starting broadcast:', error);
      alert('서버에 문제가 발생했습니다. 나중에 다시 시도해주세요.');
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
                    onChange={(e) => handleInputChange(item.id, 'entity', e.target.value)}
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
                    onChange={(e) => handleInputChange(item.id, 'minValue', e.target.value)}
                    min="0"
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
