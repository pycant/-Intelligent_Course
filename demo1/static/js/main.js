// static/js/main.js

// 导航功能
function navigateTo(path) {
    window.location.href = path;
}

// 页面加载后执行
document.addEventListener('DOMContentLoaded', function() {
    // 卡片悬停效果增强
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.08)';
        });
    });
    
    // 首页动画效果
    const introImage = document.querySelector('.placeholder-image');
    if (introImage) {
        setTimeout(() => {
            introImage.innerHTML = `
                <div style="font-size: 4rem;">⛩️</div>
                <div style="margin-top: 1rem;">许真君斩蛟治水</div>
            `;
        }, 1000);
    }
    
    // 时间线动画
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = 1;
            item.style.transform = 'translateY(0)';
        }, 300 * index);
    });
    
    // 初始设置时间线项目样式
    timelineItems.forEach(item => {
        item.style.opacity = 0;
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
});

// === 增强导航功能 ===
function navigateTo(path) {
    // 添加转场动画
    document.body.style.opacity = 0;
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        window.location.href = path;
    }, 300);
}

// === 添加页面加载动画 ===
window.addEventListener('load', function() {
    document.body.style.opacity = 0;
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = 1;
    }, 100);
});

// === 增强卡片点击效果 ===
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
});

// === 添加历史时间线点击效果 ===
document.querySelectorAll('.timeline-item').forEach(item => {
    item.addEventListener('click', function() {
        this.style.transform = 'scale(1.03)';
        this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
        setTimeout(() => {
            this.style.transform = '';
            this.style.boxShadow = '';
        }, 300);
    });
});