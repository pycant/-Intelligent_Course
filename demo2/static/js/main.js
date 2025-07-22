// static/js/main.js
document.addEventListener('DOMContentLoaded', function() {
    // 时间轴交互
    const floodEvent = document.querySelector('.flood-event');
    const comparisonModal = document.querySelector('.comparison-modal');
    const closeModal = document.querySelector('.close-modal');
    
    if (floodEvent) {
        floodEvent.addEventListener('click', function(e) {
            if (e.target.classList.contains('compare-btn')) {
                comparisonModal.classList.remove('hidden');
            }
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            comparisonModal.classList.add('hidden');
        });
    }
    
    // 砌石结构拖拽交互
    const dragTarget = document.getElementById('dam-target');
    if (dragTarget) {
        dragTarget.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.backgroundColor = '#e0e0e0';
        });
        
        dragTarget.addEventListener('dragleave', function() {
            this.style.backgroundColor = '';
        });
        
        dragTarget.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.backgroundColor = '';
            this.innerHTML = '<div class="success-message">✓ Stone Structure Secured</div>';
            // TODO: 添加砌石结构图
        });
    }
    
    // 水利模拟器
    const simulator = document.getElementById('simulator');
    if (simulator) {
        const canvas = document.getElementById('river-canvas');
        const ctx = canvas.getContext('2d');
        const angleInput = document.getElementById('dam-angle');
        const positionInput = document.getElementById('dam-position');
        const simulateBtn = document.getElementById('simulate-btn');
        const flowMeter = document.getElementById('main-flow');
        const flowPercent = document.getElementById('flow-percent');
        const resultMessage = document.getElementById('result-message');
        
        // 初始绘制
        drawRiverSystem(45, 50);
        
        angleInput.addEventListener('input', function() {
            document.getElementById('angle-value').textContent = this.value + '°';
            drawRiverSystem(this.value, positionInput.value);
        });
        
        positionInput.addEventListener('input', function() {
            document.getElementById('position-value').textContent = this.value + '%';
            drawRiverSystem(angleInput.value, this.value);
        });
        
        simulateBtn.addEventListener('click', function() {
            const angle = parseInt(angleInput.value);
            const position = parseInt(positionInput.value);
            const effectiveness = calculateEffectiveness(angle, position);
            
            // 更新流量显示
            flowMeter.value = effectiveness;
            flowPercent.textContent = effectiveness + '%';
            
            // 显示结果
            resultMessage.classList.remove('hidden');
            if (effectiveness >= 70) {
                resultMessage.textContent = '✓ River Tamed! Farmland Protected';
                resultMessage.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
                resultMessage.style.color = '#2e7d32';
                // TODO: 触发稻穗生长动画
            } else {
                resultMessage.textContent = '⚠️ Flood Risk! Adjust Dam Position';
                resultMessage.style.backgroundColor = 'rgba(231, 76, 60, 0.2)';
                resultMessage.style.color = '#c62828';
                // TODO: 触发洪水动画
            }
        });
        
        function drawRiverSystem(angle, position) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // 绘制主河道
            ctx.fillStyle = '#64b5f6';
            ctx.fillRect(50, 150, 700, 100);
            
            // 绘制支流
            ctx.fillRect(350, 250, 200, 50);
            
            // 绘制堤坝
            const damX = 50 + (700 * position / 100);
            ctx.save();
            ctx.translate(damX, 200);
            ctx.rotate(-angle * Math.PI / 180);
            ctx.fillStyle = '#8d6e63';
            ctx.fillRect(0, -10, 150, 20);
            ctx.restore();
            
            // 绘制农田区域
            ctx.fillStyle = 'rgba(76, 175, 80, 0.3)';
            ctx.fillRect(50, 50, 700, 100);
            ctx.fillRect(50, 250, 700, 100);
        }
        
        function calculateEffectiveness(angle, position) {
            // 简化版计算逻辑
            const angleScore = Math.max(0, 80 - Math.abs(angle - 45));
            const positionScore = Math.max(0, 80 - Math.abs(position - 60));
            return Math.min(100, Math.floor((angleScore + positionScore) / 1.6));
        }
    }
    
    // 诗歌交互
    const poemLines = document.querySelectorAll('.poem-line');
    poemLines.forEach(line => {
        line.addEventListener('click', function() {
            const term = this.dataset.term;
            if (term) {
                alert(`Engineering term: ${term}\n\nDefinition will appear here with diagram in final version`);
                // TODO: 显示术语解释和工程图解
            }
        });
    });
    
    const generateBtn = document.getElementById('generate-poem');
    if (generateBtn) {
        generateBtn.addEventListener('click', async function() {
            const selected = document.querySelectorAll('input[name="keyword"]:checked');
            const keywords = Array.from(selected).map(el => el.value);
            
            try {
                const response = await fetch('/api/poem?keywords=' + keywords.join(','));
                const data = await response.json();
                
                const poemDisplay = document.getElementById('custom-poem');
                poemDisplay.textContent = data.poem;
                poemDisplay.classList.remove('hidden');
            } catch (error) {
                console.error('Error generating poem:', error);
            }
        });
    }
});