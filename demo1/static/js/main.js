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
    // 初始设置时间线项目样式
    timelineItems.forEach(item => {
        item.style.opacity = 0;
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        // 为卡片添加轻微旋转效果
        const card = item.querySelector('.timeline-card');
        if (card) {
            card.style.transform = 'rotateY(5deg)';
            card.style.transition = 'transform 0.5s ease';
        }
    });

    // 时间线动画
    timelineItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = 1;
            item.style.transform = 'translateY(0)';
            
            // 卡片旋转复位
            const card = item.querySelector('.timeline-card');
            if (card) {
                setTimeout(() => {
                    card.style.transform = 'rotateY(0deg)';
                }, 300);
            }
        }, 300 * index);
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

// 添加卡片点击事件（移动设备支持）
document.querySelectorAll('.timeline-card').forEach(card => {
    card.addEventListener('click', function() {
        // 在移动设备上切换显示
        if (window.innerWidth <= 768) {
            const back = this.querySelector('.card-back');
            if (back.style.display === 'block') {
                back.style.display = 'none';
            } else {
                back.style.display = 'block';
            }
        }
    });
});

// 添加卡片悬停效果
document.querySelectorAll('.timeline-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
    });
    
    card.addEventListener('mouseleave', function() {
        if (!this.classList.contains('flipped')) {
            this.style.transform = '';
            this.style.boxShadow = '';
        }
    });
});
});
