// src/login/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; // CSS 파일 import

const LoginPage = ({ setUser }) => { // setUser prop 추가
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 로그인 처리
        const userData = {
            usrEml: email,
            usrPwd: password,
        };
    
        try {
            const response = await fetch('http://localhost:3001/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
    
            if (!response.ok) {
                throw new Error('로그인 실패');
            }
    
            const result = await response.json();
            console.log('로그인 성공:', result);
    
            // 로그인 성공 후 사용자 정보 저장
            setUser(result); // 상태에 저장
            localStorage.setItem('user', JSON.stringify(result)); // 로컬 스토리지에 저장
    
            navigate('/'); // 메인 페이지로 이동
        } catch (error) {
            console.error('Error during login:', error);
            alert('로그인 실패: ' + error.message); // 오류 메시지 표시
        }
    };
    

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>로그인</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">이메일</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="이메일을 입력하세요"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호를 입력하세요"
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">
                        로그인
                    </button>
                </form>
                <div className="help-links">
                    <a href="/find-id">아이디 찾기</a>
                    <span> | </span>
                    <a href="/find-password">비밀번호 찾기</a>
                </div>
                <p className="signup-link">
                    계정이 없으신가요? <Link to="/signUp">회원가입</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
