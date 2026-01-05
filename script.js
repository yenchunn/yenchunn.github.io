// ========================================
// 輪播廣告功能
// ========================================

let currentIndex = 0;
let autoPlayInterval = null;

// 切換幻燈片
function moveSlide(step) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-indicators .dot');
    
    if (slides.length === 0) return;

    // 移除當前 active
    slides[currentIndex].classList.remove('active');
    if (dots[currentIndex]) {
        dots[currentIndex].classList.remove('active');
    }
    
    // 計算新索引
    currentIndex = (currentIndex + step + slides.length) % slides.length;
    
    // 加入新 active
    slides[currentIndex].classList.add('active');
    if (dots[currentIndex]) {
        dots[currentIndex].classList.add('active');
    }
    
    // 重新調整圖片地圖
    rwdImageMap();
}

// 自動輪播
function startAutoPlay() {
    // 清除舊的定時器（避免重複）
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
    }
    
    // 每 5 秒自動切換到下一張
    autoPlayInterval = setInterval(() => {
        moveSlide(1);
    }, 5000); // 5000ms = 5秒
}

// 停止自動輪播
function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}

// 響應式圖片地圖
function rwdImageMap() {
    const maps = document.getElementsByTagName('map');
    for (let map of maps) {
        const img = document.querySelector(`img[usemap="#${map.name}"]`);
        if (!img) continue;

        const ratio = img.clientWidth / img.naturalWidth; // 計算縮放比例
        const areas = map.getElementsByTagName('area');

        for (let area of areas) {
            if (!area.dataset.coords) area.dataset.coords = area.coords; // 備份原始座標
            
            const coords = area.dataset.coords.split(',');
            const scaledCoords = coords.map(c => Math.round(c * ratio));
            area.coords = scaledCoords.join(',');
        }
    }
}

// ========================================
// 頁面載入完成後執行
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // 啟動輪播功能
    startAutoPlay();
    
    // 當滑鼠移到輪播區域時暫停自動播放
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);
    }
    
    // 綁定左右按鈕點擊事件（點擊後暫停3秒再繼續）
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            stopAutoPlay();
            setTimeout(startAutoPlay, 3000); // 3秒後恢復自動播放
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            stopAutoPlay();
            setTimeout(startAutoPlay, 3000); // 3秒後恢復自動播放
        });
    }

    // ========================================
    // 登入/註冊表單切換（僅在登入頁面）
    // ========================================
    
    const authTitle = document.getElementById('auth-title');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const switchBtn = document.getElementById('switch-auth');
    const footerText = document.getElementById('footer-text');

    if (switchBtn && loginForm && registerForm) {
        switchBtn.addEventListener('click', function() {
            if (loginForm.style.display !== 'none') {
                // 切換到註冊
                loginForm.style.display = 'none';
                registerForm.style.display = 'block';
                authTitle.innerText = '會員註冊';
                footerText.innerText = '已經是會員了？';
                switchBtn.innerText = '點此登入';
            } else {
                // 切換回登入
                loginForm.style.display = 'block';
                registerForm.style.display = 'none';
                authTitle.innerText = '會員登入';
                footerText.innerText = '還不是會員？';
                switchBtn.innerText = '點此註冊';
            }
        });
    }
});

// 監聽圖片載入與視窗縮放
window.addEventListener('load', rwdImageMap);
window.addEventListener('resize', rwdImageMap);

// ========================================
// 登入驗證
// ========================================

function validateAndLogin() {
    const email = document.getElementById('login-email')?.value;
    const password = document.getElementById('login-password')?.value;

    if (!email || !password) {
        alert("請輸入完整的帳號與密碼！");
        return;
    }

    if (!email.includes("@")) {
        alert("Email 格式不正確！");
        return;
    }

    if (password.length < 6) {
        alert("密碼長度不足！");
        return;
    }

    alert("登入成功！歡迎回到 FLORA");
    window.location.href = 'index.html'; 
}

// ========================================
// 註冊驗證
// ========================================

function validateAndRegister() {
    const elName = document.getElementById('reg-name');
    const elEmail = document.getElementById('reg-email');
    const elPhone = document.getElementById('reg-phone');
    const elAddress = document.getElementById('reg-address');
    const elPw = document.getElementById('reg-password');

    if (!elName || !elEmail || !elPhone || !elAddress || !elPw) {
        console.error("錯誤：找不到其中一個輸入框的 ID，請檢查 HTML！");
        alert("系統錯誤：找不到輸入欄位");
        return;
    }

    const name = elName.value.trim();
    const email = elEmail.value.trim();
    const phone = elPhone.value.trim();
    const address = elAddress.value.trim();
    const password = elPw.value.trim();

    if (name === "" || email === "" || phone === "" || address === "" || password === "") {
        alert("所有欄位都是必填的喔！");
        return;
    }

    if (!email.includes("@")) {
        alert("Email 格式看起來不太對勁...");
        return;
    }

    if (phone.length < 9) {
        alert("電話號碼長度不足！");
        return;
    }

    if (password.length < 6) {
        alert("密碼長度不足！");
        return;
    }

    alert("註冊成功！歡迎來到 FLORA");
    window.location.href = 'index.html'; 
}


function openModal(type) {
  const title = document.getElementById("modalTitle");
  const content = document.getElementById("modalContent");

  if (type === "privacy") {
    title.innerText = "隱私權政策";
    content.innerHTML = `
      
      <p>
        本網站重視您的隱私權，僅於提供服務之必要範圍內蒐集使用者資料，
        並採取合理之安全措施進行保護，不會任意提供予第三方。
      </p>
    `;
  } 
  else if (type === "terms") {
    title.innerText = "服務條款";
    content.innerHTML = `
      <img src="images/policy/terms1.jpg" class="policy-img">
      <img src="images/policy/terms2.jpg" class="policy-img">
      <p>
        使用本網站即表示您同意遵守本平台之所有使用規範，
        如有違反，本網站有權限制或終止相關服務。
      </p>
    `;
  }

  document.getElementById("modalOverlay").style.display = "block";
  document.getElementById("modalBox").style.display = "block";
}

