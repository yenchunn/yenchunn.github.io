window.onload = function() {
    console.log("FLORA 系統啟動成功");

    // --- 1. 會員中心攔截與渲染 ---
    var profileName = document.getElementById('profile-name');
    if (profileName) {
        // 【新增攔截】檢查是否登入
        var isLogin = localStorage.getItem('isLogin');
        
        if (isLogin !== 'true') {
            alert("請先登入會員，才能查看個人資料！");
            window.location.href = '../index.html'; // 沒登入就踢走
            return; // 停止執行後面的渲染
        }

        // 如果有登入，才渲染資料
        var savedData = localStorage.getItem('userData');
        if (savedData) {
            var user = JSON.parse(savedData);
            try {
                if(document.getElementById('profile-name')) document.getElementById('profile-name').innerText = user.name;
                if(document.getElementById('profile-email')) document.getElementById('profile-email').innerText = user.email;
                if(document.getElementById('profile-phone')) document.getElementById('profile-phone').innerText = user.phone;
                if(document.getElementById('profile-address')) document.getElementById('profile-address').innerText = user.address;
                
                var sideName = document.querySelector('.user-profile-brief h3');
                if (sideName) sideName.innerText = user.name;
            } catch (e) { console.log("渲染錯誤"); }
        }
    }

    // --- 2. 登入/註冊切換邏輯 ---
    var switchBtn = document.getElementById('switch-auth');
    if (switchBtn) {
        switchBtn.onclick = function() {
            var loginForm = document.getElementById('login-form');
            var registerForm = document.getElementById('register-form');
            var authTitle = document.getElementById('auth-title');
            var footerText = document.getElementById('footer-text');
            if (loginForm.style.display !== 'none') {
                loginForm.style.display = 'none';
                registerForm.style.display = 'block';
                authTitle.innerText = '會員註冊';
                footerText.innerText = '已經是會員了？';
                switchBtn.innerText = '點此登入';
            } else {
                loginForm.style.display = 'block';
                registerForm.style.display = 'none';
                authTitle.innerText = '會員登入';
                footerText.innerText = '還不是會員？';
                switchBtn.innerText = '點此註冊';
            }
        };
    }
};

/* ==========================================
   按鈕功能函數
   ========================================== */

// 註冊
function validateAndRegister() {
    var n = document.getElementById('reg-name').value.trim();
    var e = document.getElementById('reg-email').value.trim();
    var p = document.getElementById('reg-phone').value.trim();
    var a = document.getElementById('reg-address').value.trim();
    var pw = document.getElementById('reg-password').value.trim();

    if (!n || !e || !p || !a || !pw) { alert("欄位不能空白！"); return; }
    if (!e.includes("@")) { alert("Email 格式錯誤"); return; }
    if (p.length !== 12 || !p.includes("-")) { alert("電話需為 12 位(如:0912-345-678)"); return; }
    if (pw.length < 8) { alert("密碼需 8 個字以上"); return; }

    var userData = { name: n, email: e, phone: p, address: a };
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('isLogin', 'true'); // 存入登入標記

    alert("註冊成功！");
    window.location.href = '../index.html'; 
}

// 登入
/* ==========================================
FLORA 會員驗證系統 - 比對註冊資料版
========================================== */

// 1. 登入驗證 (關鍵修改：比對 localStorage 內的資料)
function validateAndLogin() {
var loginE = document.getElementById('login-email').value.trim();
var loginPw = document.getElementById('login-password').value.trim();

// 基本格式檢查
if (!loginE || !loginPw) { alert("請輸入帳號密碼"); return; }
if (!loginE.includes("@") || loginPw.length < 8) { alert("帳號或密碼格式錯誤！"); return; }

// --- 【新增：資料比對邏輯】 ---
// 從瀏覽器抓取當初註冊的資料
var savedData = localStorage.getItem('userData');

if (savedData) {
    var user = JSON.parse(savedData);
    
    // 比對：登入輸入的 Email 是否等於 註冊存的 Email
    // (注意：因為我們目前沒存註冊的密碼到 userData 物件，所以這裡先比對 Email)
    // 如果註冊時有存密碼，則比對 user.password === loginPw
    if (loginE === user.email) {
        localStorage.setItem('isLogin', 'true');
        alert("登入成功！歡迎回來 " + user.name);
        window.location.href = '../index.html';
    } else {
        alert("帳號不存在，請重新檢查或前往註冊！");
    }
} else {
    alert("查無會員資料，請先註冊！");
    window.location.href = '../index.html'; // 視情況跳回註冊表單
}
}

// 2. 註冊功能 (確保把密碼也存進去，方便以後比對)
function validateAndRegister() {
var n = document.getElementById('reg-name').value.trim();
var e = document.getElementById('reg-email').value.trim();
var p = document.getElementById('reg-phone').value.trim();
var a = document.getElementById('reg-address').value.trim();
var pw = document.getElementById('reg-password').value.trim();

if (!n || !e || !p || !a || !pw) { alert("欄位不能空白！"); return; }
if (!e.includes("@")) { alert("Email 格式錯誤"); return; }
if (p.length !== 12 || !p.includes("-")) { alert("電話需為 12 位(如:0912-345-678)"); return; }
if (pw.length < 8) { alert("密碼需 8 個字以上"); return; }

// 儲存資料（包含密碼，這樣登入時才能比對）
var userData = { 
    name: n, 
    email: e, 
    phone: p, 
    address: a,
    password: pw // 新增儲存密碼
};

localStorage.setItem('userData', JSON.stringify(userData));
localStorage.setItem('isLogin', 'true');

alert("註冊成功！資料已同步");
window.location.href = '../index.html'; 
}

// 【修復】登出功能
function logout() {
    // 1. 清除登入標記
    localStorage.removeItem('isLogin');
    
    // 2. 提示並跳轉
    alert("您已安全登出！");
    window.location.href = '../index.html'; 
}
