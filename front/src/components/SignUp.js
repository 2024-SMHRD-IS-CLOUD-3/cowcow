// src/signup/SignUp.js
import React, { useState } from 'react';
import './SignUp.css'; // CSS 파일 import
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 useNavigate 사용
import { Link } from 'react-router-dom'

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState(''); // 이름 상태 추가
    const [isVerified, setIsVerified] = useState(null); // 이메일 인증 성공 여부
    const [isSubmitted, setIsSubmitted] = useState(false); // 회원가입 성공 여부
    const navigate = useNavigate(); // 페이지 이동 함수

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isVerified) {
            alert('이메일 인증이 필요합니다.');
            return;
        }
        console.log('회원가입 정보:', { email, password, phone, name });
        setIsSubmitted(true); // 회원가입 성공 처리
    };

    const verifyEmail = () => {
        if (email) {
            setIsVerified(true); // 인증 성공
        } else {
            setIsVerified(false); // 인증 실패
        }
    };

    const goToLogin = () => {
        navigate('/'); // 로그인 페이지로 이동
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h2>회원가입</h2>
                {isSubmitted ? (
                    <div className="success-message">
                        <p>회원가입이 정상적으로 완료되었습니다!</p>
                        <button onClick={goToLogin} className="go-login-button">
                            로그인하러 가기
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="email">이메일</label>
                            <div className="email-group">
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="이메일을 입력하세요"
                                    required
                                />
                                <button
                                    type="button"
                                    className="verify-button"
                                    onClick={verifyEmail}
                                >
                                    인증하기
                                </button>
                            </div>
                            {isVerified === true && (
                                <span className="verification-message success">
                                    인증완료
                                </span>
                            )}
                            {isVerified === false && (
                                <span className="verification-message failure">
                                    인증실패
                                </span>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="name">이름</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)} // 수정된 부분
                                placeholder="이름을 입력하세요"
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
                                minLength={8}
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
                        </div>

                        <button type="submit" className="signup-button">
                            회원가입
                        </button>
                    </form>
                )}

                {!isSubmitted && (
                    <p className="login-link">
                        이미 계정이 있으신가요?{' '}
                        <Link to='/login'>
                        <a className="login-link-text">
                            로그인
                        </a>
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default SignUp;
