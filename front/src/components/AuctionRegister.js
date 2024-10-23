import React, { useState } from 'react';
import './AuctionRegister.css';

const AuctionRegister = () => {
  const [showModal, setShowModal] = useState(false);
  const [farmName, setFarmName] = useState('');
  const [items, setItems] = useState([{ id: 1, entity: '', minValue: '' }]);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

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

  const handleFarmNameChange = (e) => setFarmName(e.target.value);

  const handleBroadcastStart = () => {
    if (!farmName) {
      alert('농장 이름을 입력해주세요.');
      return;
    }
    alert(`방송이 시작되었습니다! 농장 이름: ${farmName}`);
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
              <label>농장 이름</label>
              <input
                type="text"
                value={farmName}
                onChange={handleFarmNameChange}
                placeholder="농장 이름을 입력하세요"
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
                    <option value="">선택</option>
                    <option value="1">1번 개체</option>
                    <option value="2">2번 개체</option>
                    <option value="3">3번 개체</option>
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
