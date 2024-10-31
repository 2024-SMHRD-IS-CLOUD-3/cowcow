import React, { useState, useEffect } from 'react';
import './MyPage.css';
import Sidebar from './Sidebar';

const MyPage = ({ user, setUser, isDarkMode }) => { // isDarkMode 추가
    const [showTopButton, setShowTopButton] = useState(false);
    const [barns, setBarns] = useState([]);

    useEffect(() => {
        const fetchUserBarn = async () => {
            try {
                const response = await fetch(`http://223.130.160.153:3001/user-barns/user/${user.usrSeq}`);
                if (!response.ok) throw new Error("농가 정보를 가져오는 데 실패했습니다.");
                const userBarn = await response.json();
                setBarns(userBarn);
            } catch (error) {
                console.error("Error fetching user-barns data", error);
            }
        };
        if (user?.usrSeq) fetchUserBarn();
    }, [user]);

    const handleScroll = () => setShowTopButton(window.scrollY > 100);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <div className={`mypage-layout ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="content-container">
                <Sidebar />
                <section className="mypage-content">
                    <h1>개인정보 변경</h1>
                    <ProfileInfo user={user} userBarns={barns} setBarns={setBarns} />
                </section>
            </div>
            {showTopButton && (
                <button id="topButton" onClick={scrollToTop} title="맨 위로">Top</button>
            )}
        </div>
    );
};

const ProfileInfo = ({ user, userBarns, setBarns }) => {
    const [newBarnName, setNewBarnName] = useState('');

    const handleAddBarn = async () => {
        if (newBarnName.trim() === '') {
            alert('농가 이름을 입력하세요.');
            return;
        }
        if (userBarns.length < 3) {
            try {
                const newBarn = { usrSeq: user.usrSeq, usrBarnName: newBarnName };
                const response = await fetch('http://223.130.160.153:3001/user-barns', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newBarn),
                });
                if (!response.ok) throw new Error('농가 추가에 실패했습니다.');
                const createdBarn = await response.json();
                setBarns([...userBarns, createdBarn]);
                setNewBarnName('');
            } catch (error) {
                console.error("Error adding new barn", error);
            }
        }
    };

    const handleRemoveBarn = async (id, index) => {
        const confirmed = window.confirm('삭제하시겠습니까?');
        if (!confirmed) return;

        try {
            const response = await fetch(`http://223.130.160.153:3001/user-barns/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('농가 삭제에 실패했습니다.');
            setBarns(userBarns.filter((_, i) => i !== index));
        } catch (error) {
            console.error("Error removing barn", error);
        }
    };

    const handleChangeBarn = (index, value) => {
        const updatedBarns = [...userBarns];
        updatedBarns[index].usrBarnName = value;
        setBarns(updatedBarns);
    };

    return (
        <div className="profile-info">
            <InputField label="이름" value={user ? user.usrNm : '이름 없음'} />
            <InputField label="이메일" value={user ? user.usrEml : '이메일 없음'} />
            <InputField label="전화번호" value={user ? user.usrPhn : '전화번호 없음'} />

            <label className="address-label">농가이름</label>
            {userBarns.map((barn, index) => (
                <div key={index} className="address-group">
                    <input
                        type="text"
                        value={barn.usrBarnName || ''}
                        onChange={(e) => handleChangeBarn(index, e.target.value)}
                        placeholder="농가 이름을 입력하세요"
                    />
                    <button
                        className="btn remove-address"
                        onClick={() => handleRemoveBarn(barn.usrBarnSeq, index)}
                        disabled={userBarns.length === 0}
                    >
                        삭제
                    </button>
                </div>
            ))}

            {userBarns.length < 3 && (
                <div className="address-group">
                    <input
                        type="text"
                        value={newBarnName}
                        onChange={(e) => setNewBarnName(e.target.value)}
                        placeholder="새로운 농가 이름을 입력하세요"
                    />
                    <button
                        className="btn add-address"
                        onClick={handleAddBarn}
                    >
                        추가
                    </button>
                </div>
            )}
        </div>
    );
};

const InputField = ({ label, value }) => (
    <div className="form-group">
        <label>{label}</label>
        <div className="input-wrapper">
            <input type="text" value={value} readOnly />
            <button className="btn change-btn">변경</button>
        </div>
    </div>
);

export default MyPage;
