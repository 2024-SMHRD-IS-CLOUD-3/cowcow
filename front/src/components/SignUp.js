// src/signup/SignUp.js
import React, { useState } from 'react';
import './SignUp.css'; // CSS 파일 import
import { Link, useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 useNavigate 사용

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false); // 인증번호 전송 여부
    const [inputVerificationCode, setInputVerificationCode] = useState(''); // 입력된 인증번호
    const [isVerified, setIsVerified] = useState(false); // 인증 성공 여부
    const navigate = useNavigate(); // 페이지 이동 함수

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isVerified) {
            alert('전화번호 인증이 필요합니다.');
            return;
        }
        console.log('회원가입 정보:', email, password, phone);
        // 회원가입 처리 로직 추가
    };

    const sendVerificationCode = () => {
        if (!phone) {
            alert('전화번호를 입력하세요.');
            return;
        }
        const generatedCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6자리 랜덤 인증번호 생성
        setVerificationCode(generatedCode);
        alert(`인증번호가 전송되었습니다: ${generatedCode}`);
        setIsCodeSent(true); // 인증번호 입력 칸 표시
    };

    const verifyCode = () => {
        if (inputVerificationCode === verificationCode) {
            setIsVerified(true);
            alert('전화번호 인증이 완료되었습니다.');
        } else {
            alert('인증번호가 일치하지 않습니다.');
        }
    };

    const goToLogin = () => {
        navigate('/'); // 로그인 페이지로 이동
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h2>회원가입</h2>
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
                    <div className="input-group phone-input">
                        <label htmlFor="phone">전화번호</label>
                        <input
                            type="tel"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="전화번호를 입력하세요"
                            required
                        />
                        <button
                            type="button"
                            className="send-code-button"
                            onClick={sendVerificationCode}
                        >
                            인증번호
                        </button>
                    </div>
                    {isCodeSent && (
                        <div className="input-group">
                            <label htmlFor="verification-code">인증번호 입력</label>
                            <input
                                type="text"
                                id="verification-code"
                                value={inputVerificationCode}
                                onChange={(e) => setInputVerificationCode(e.target.value)}
                                placeholder="인증번호를 입력하세요"
                                required
                            />
                            <button
                                type="button"
                                className="check-button"
                                onClick={verifyCode}
                            >
                                확인
                            </button>
                        </div>
                    )}
                    <button type="submit" className="signup-button">
                        회원가입
                    </button>
                </form>

                <p className="login-link">
                    이미 계정이 있으신가요?{' '}
                    <Link to = "/login">
                        <a className="login-link-text">
                            로그인
                        </a>
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
