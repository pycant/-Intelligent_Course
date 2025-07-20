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