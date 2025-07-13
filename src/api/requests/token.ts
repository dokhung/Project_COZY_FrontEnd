async function refreshAccessToken() {
    const res = await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' });
    if (res.ok) {
        const data = await res.json();
        localStorage.setItem('accessToken', data.accessToken);
    } else {
        console.log('토큰 갱신 실패, 다시 로그인 필요');
    }
}
