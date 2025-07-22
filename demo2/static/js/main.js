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
    // static/js/main.js 新增功能
    // 在DOMContentLoaded事件内添加以下代码

    // AI问答功能
    const aiToggle = document.getElementById('ai-toggle');
    const aiChatbox = document.querySelector('.ai-chatbox');
    const closeChat = document.querySelector('.close-chat');
    const aiSendBtn = document.getElementById('ai-send');
    const aiQuestionInput = document.getElementById('ai-question');
    const chatHistory = document.getElementById('chat-history');

    if (aiToggle) {
        aiToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            aiChatbox.classList.toggle('hidden');
            aiChatbox.classList.add('active');
            document.querySelector('.ai-chatbox .chat-input input').focus();
        });
    }

    if (closeChat) {
        closeChat.addEventListener('click', () => {
            aiChatbox.classList.add('hidden');
        });
    }

    if (aiSendBtn) {
        aiSendBtn.addEventListener('click', sendQuestion);
        aiQuestionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendQuestion();
        });
    }

    function sendQuestion() {
        const question = aiQuestionInput.value.trim();
        if (!question) return;
        
        // 添加用户消息
        addMessage(question, 'user');
        aiQuestionInput.value = '';
        
        // 发送到DeepSeek API
        fetch('/api/ai-answer', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ prompt: question })
        })
        .then(response => response.json())
        .then(data => {
            if (data.answer) {
                addMessage(data.answer, 'ai');
            } else {
                addMessage("Sorry, I couldn't get an answer. Please try again later.", 'ai');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            addMessage("An error occurred. Please try again.", 'ai');
        });
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.textContent = text;
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // 词汇翻译功能
    const vocabTranslator = document.querySelector('.vocab-translator');
    const closeTranslator = document.querySelector('.close-translator');
    const translatedWord = document.getElementById('translated-word');
    const aiExplanation = document.getElementById('ai-explanation');
    const askAiBtn = document.getElementById('ask-ai-btn');

    // 翻译词典
    const vocabDictionary = {
        "Qianjinbei": "千金陂 (Ancient stone diversion dam)",
        "diversion": "导流 (Diverting water flow)",
        "Fuzhou": "抚州 (City in Jiangxi province)",
        "Tang Xianzu": "汤显祖 (Ming Dynasty playwright)",
        "irrigation": "灌溉 (Watering crops)",
        "hydraulic": "水利的 (Related to water engineering)",
        "cultural": "文化的 (Related to culture and arts)"
    };

    // 标记页面中的专业术语
    document.querySelectorAll('p, h1, h2, h3, li').forEach(element => {
        const words = element.innerHTML.split(/\b/);
        element.innerHTML = words.map(word => {
            const cleanWord = word.replace(/[.,?!;:]/g, '');
            if (vocabDictionary[cleanWord]) {
                return `<span class="vocab-word" data-word="${cleanWord}">${word}</span>`;
            }
            return word;
        }).join('');
    });

    // 绑定词汇点击事件
    document.querySelectorAll('.vocab-word').forEach(word => {
        word.addEventListener('click', function() {
            const term = this.dataset.word;
            translatedWord.innerHTML = `<strong>${term}</strong>: ${vocabDictionary[term]}`;
            
            // 显示AI解释
            aiExplanation.textContent = "Loading explanation...";
            vocabTranslator.classList.remove('hidden');
            
            // 获取AI解释
            fetch('/api/ai-answer', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ 
                    prompt: `Explain the term "${term}" in the context of Jiangxi water culture in 1-2 sentences.`
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.answer) {
                    aiExplanation.textContent = data.answer;
                } else {
                    aiExplanation.textContent = "Could not load explanation.";
                }
            });
        });
    });

    if (closeTranslator) {
        closeTranslator.addEventListener('click', () => {
            vocabTranslator.classList.add('hidden');
        });
    }

    if (askAiBtn) {
        askAiBtn.addEventListener('click', () => {
            const term = document.querySelector('.vocab-word.active')?.dataset.word;
            if (term) {
                aiChatbox.classList.remove('hidden');
                aiQuestionInput.value = `Tell me more about ${term} in Jiangxi water culture`;
                sendQuestion();
            }
        });
    }

    // 翻译游戏功能
    const gameOptions = document.querySelectorAll('.options button');
    const gameFeedback = document.getElementById('game-feedback');
    let correctAnswers = 0;

    gameOptions.forEach(option => {
        option.addEventListener('click', function() {
            const isCorrect = this.dataset.correct === 'true';
            const wordId = this.dataset.id;
            
            // 更新UI
            if (isCorrect) {
                this.style.backgroundColor = '#4CAF50';
                this.style.color = 'white';
                correctAnswers++;
            } else {
                this.style.backgroundColor = '#F44336';
                this.style.color = 'white';
                // 高亮显示正确答案
                const correctBtn = document.querySelector(`.options button[data-id="${wordId}"][data-correct="true"]`);
                if (correctBtn) {
                    correctBtn.style.backgroundColor = '#4CAF50';
                    correctBtn.style.color = 'white';
                }
            }
            
            // 禁用所有选项
            document.querySelectorAll(`.options button[data-id="${wordId}"]`).forEach(btn => {
                btn.disabled = true;
            });
            
            // 检查游戏完成状态
            if (correctAnswers === 6) {
                gameFeedback.classList.remove('hidden');
                gameFeedback.innerHTML = `
                    <div class="success-message">✓ Excellent! You found all incorrect translations</div>
                    <p>Tang Xianzu's poetry captures the essence of water culture in Jiangxi.</p>
                `;
            }
        });
    });

    // 知识检验功能
    const quizForm = document.getElementById('quiz-form');
    const quizResults = document.getElementById('quiz-results');

    if (quizForm) {
        quizForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 计算选择题和判断题分数
            let mcScore = 0;
            let tfScore = 0;
            
            // 正确答案
            const correctAnswers = {
                q1: 'a',
                q5: 'true'
            };
            
            // 检查答案
            for (const [question, correct] of Object.entries(correctAnswers)) {
                const selected = this.elements[question].value;
                if (selected === correct) {
                    if (question.startsWith('q')) mcScore++;
                    else tfScore++;
                }
            }
            
            // 显示分数
            document.getElementById('mc-score').textContent = mcScore;
            document.getElementById('tf-score').textContent = tfScore;
            
            // 处理创作题
            const creativeAnswer = this.elements['q8'].value;
            document.getElementById('creative-feedback').innerHTML = `
                <p>Your answer is being evaluated by AI...</p>
                <div class="ai-evaluation" id="ai-evaluation"></div>
            `;
            
            // 发送到AI评估
            fetch('/api/ai-answer', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ 
                    prompt: `Evaluate this answer about Qianjinbei's cultural impact: "${creativeAnswer}". 
                    Use a 5-point scale for: Historical accuracy (1-5), Cultural insight (1-5), 
                    and Language quality (1-5). Provide brief feedback.`
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.answer) {
                    document.getElementById('ai-evaluation').innerHTML = `
                        <h4>AI Evaluation:</h4>
                        <p>${data.answer}</p>
                    `;
                }
            });
            
            // 显示结果
            quizResults.classList.remove('hidden');
        });
    }

    // 全景图控制
    const panLeftBtn = document.querySelector('.pan-left');
    const panRightBtn = document.querySelector('.pan-right');
    const panoramaImg = document.querySelector('.panorama-img');

    if (panLeftBtn && panRightBtn) {
        let panPosition = 0;
        
        panLeftBtn.addEventListener('click', () => {
            panPosition = Math.max(panPosition - 20, 0);
            panoramaImg.style.transform = `translateX(${panPosition}px)`;
        });
        
        panRightBtn.addEventListener('click', () => {
            panPosition = Math.min(panPosition + 20, 100);
            panoramaImg.style.transform = `translateX(${panPosition}px)`;
        });
    }
});