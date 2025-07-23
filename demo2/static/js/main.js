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
        // 在砌石结构拖拽处添加视觉反馈
        dragTarget.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.border = '2px dashed #4CAF50';
            this.style.backgroundColor = '#e8f5e9';
        });

        dragTarget.addEventListener('dragleave', function() {
            this.style.border = '2px dashed var(--stone-gray)';
            this.style.backgroundColor = '#f9f9f9';
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

    // AI问答功能
    let isDragging = false;
    let offsetX, offsetY;
    const aiToggle = document.getElementById('ai-toggle');
    const aiChatbox = document.querySelector('.ai-chatbox');
    const closeChat = document.querySelector('.close-chat');
    const aiSendBtn = document.getElementById('ai-send');
    const aiQuestionInput = document.getElementById('ai-question');
    const chatHistory = document.getElementById('chat-history');
    const dragHandle = document.querySelector('.drag-handle');

    if (dragHandle && aiChatbox) {
        dragHandle.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
        
        function startDrag(e) {
            isDragging = true;
            offsetX = e.clientX - aiChatbox.getBoundingClientRect().left;
            offsetY = e.clientY - aiChatbox.getBoundingClientRect().top;
            aiChatbox.style.cursor = 'grabbing';
        }
        
        function drag(e) {
            if (!isDragging) return;
            aiChatbox.style.left = (e.clientX - offsetX) + 'px';
            aiChatbox.style.top = (e.clientY - offsetY) + 'px';
        }
        
        function endDrag() {
            isDragging = false;
            aiChatbox.style.cursor = 'default';
        }
    }

    const testConnectionBtn = document.getElementById('test-connection');
    if (testConnectionBtn) {
        testConnectionBtn.addEventListener('click', testConnection);
    }

    // 多语言支持
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            const lang = this.value;
            localStorage.setItem('preferredLanguage', lang);
            addMessage(`Language changed to ${getLanguageName(lang)}`, 'ai info');
        });
    }

    // 修改AI助手显示/隐藏功能
    if (aiToggle) {
        aiToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            aiChatbox.classList.toggle('hidden');
            
            if (!aiChatbox.classList.contains('hidden')) {
                // 显示时添加动画类
                aiChatbox.classList.add('show');
                // 延迟设置焦点确保元素可见
                setTimeout(() => {
                    aiQuestionInput.focus();
                }, 100);
            } else {
                aiChatbox.classList.remove('show');
            }
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

    // 消息处理增强
    function sendQuestion() {
        const question = aiQuestionInput.value.trim();
        if (!question) return;
        
        // 添加用户消息
        addMessage(question, 'user');
        aiQuestionInput.value = '';
        
        // 检查特殊命令
        if (question.toLowerCase().startsWith('translate:')) {
            const text = question.substring(10).trim();
            handleTranslationRequest(text, getCurrentLanguage());
            return;
        }
        
        if (question.toLowerCase().startsWith('test connection')) {
            testConnection();
            return;
        }
        
        // 添加等待消息
        const waitingMsg = addMessage("Thinking...", 'ai-loading');
        
        // 发送到AI API
        fetch('/api/ai-answer', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                prompt: question,
                language: getCurrentLanguage(),
                context: getChatContext() // 添加上下文
            })
        })
        .then(response => response.json())
        .then(data => {
            // 移除等待消息
            waitingMsg.remove();
            
            if (data.answer) {
                addMessage(data.answer, 'ai');
                saveToHistory(question, data.answer);
            } else {
                addMessage("Sorry, I couldn't get an answer. Please try again later.", 'ai error');
            }
        })
        .catch(error => {
            waitingMsg.remove();
            console.error('Error:', error);
            addMessage("An error occurred. Please try again.", 'ai error');
        });
    }

    // 改进消息处理函数
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender.replace(' ', '-'));
        
        // 安全处理HTML内容
        if (sender.startsWith('ai') && text.includes('```')) {
            const parts = text.split('```');
            let formattedText = '';
            
            for (let i = 0; i < parts.length; i++) {
                if (i % 2 === 1) { // 代码块
                    formattedText += `<pre><code>${escapeHtml(parts[i])}</code></pre>`;
                } else {
                    formattedText += escapeHtml(parts[i]);
                }
            }
            
            messageDiv.innerHTML = formattedText;
        } else {
            // 安全转义HTML
            messageDiv.textContent = text;
        }
        
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
        
        return messageDiv;
    }

    // HTML转义函数
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function updateMessage(messageElement, newText, newClass) {
        if (newClass) {
            messageElement.className = `message ${newClass}`;
        }
        messageElement.innerHTML = newText;
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function testConnection() {
        const message = addMessage("Testing connection to DeepSeek API...", 'ai-loading');
        
        fetch('/api/test-connection')
            .then(response => {
                if (response.ok) {
                    updateMessage(message, "✓ Connection successful! API is ready", 'ai-success');
                } else {
                    updateMessage(message, "⚠️ Connection failed. Please try again later.", 'ai error');
                }
            })
            .catch(error => {
                updateMessage(message, `⚠️ Connection error: ${error.message}`, 'ai-error');
            });
    }
    function handleTranslationRequest(text, targetLanguage) {
        const message = addMessage(`Translating to ${getLanguageName(targetLanguage)}...`, 'ai loading');
        
        fetch('/api/translate', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ text, targetLanguage })
        })
        .then(response => response.json())
        .then(data => {
            if (data.translation) {
                updateMessage(message, `Translation (${getLanguageName(targetLanguage)}): 
                <div class="translation-result">${data.translation}</div>`, 'ai');
            } else {
                updateMessage(message, "Translation failed. Please try again.", 'ai error');
            }
        })
        .catch(error => {
            updateMessage(message, `Translation error: ${error.message}`, 'ai error');
        });
    }

    // 获取当前语言
    function getCurrentLanguage() {
    return localStorage.getItem('preferredLanguage') || 'en';
    }

    // 获取语言名称
    function getLanguageName(code) {
        const languages = {
            'en': 'English',
            'zh': '中文',
            'es': 'Spanish',
            'fr': 'French'
        };
        return languages[code] || code;
    }
    // 历史记录功能 
    function saveToHistory(question, answer) {
        const history = JSON.parse(localStorage.getItem('aiChatHistory') || '[]');
        history.push({
            question,
            answer,
            timestamp: new Date().toISOString()
        });
        
        // 只保留最近的20条记录
        if (history.length > 20) history.shift();
        
        localStorage.setItem('aiChatHistory', JSON.stringify(history));
    }

    function getChatHistory() {
        return JSON.parse(localStorage.getItem('aiChatHistory') || '[]');
    }

    function getChatContext() {
        const history = getChatHistory();
        return history.map(item => 
            `User: ${item.question}\nAssistant: ${item.answer}`
        ).join('\n\n');
    }

    // 初始化时加载历史记录
    function loadChatHistory() {
        const history = getChatHistory();
        if (history.length > 0) {
            history.forEach(item => {
                addMessage(item.question, 'user');
                addMessage(item.answer, 'ai');
            });
        } else {
            addMessage("Hello! I'm your Water Culture Assistant. Ask me about Qianjinbei, Tang Xianzu, or Jiangxi water culture.", 'ai');
        }
    }

        // 修改词汇点击事件
    document.querySelectorAll('.vocab-word').forEach(word => {
        word.addEventListener('click', function() {
            const term = this.dataset.word;
            const targetLanguage = getCurrentLanguage() === 'zh' ? 'en' : 'zh';
            
            // 显示翻译器
            vocabTranslator.classList.remove('hidden');
            translatedWord.innerHTML = `<strong>${term}</strong>`;
            aiExplanation.textContent = "Loading translation and explanation...";
            
            // 获取翻译和解释
            fetch('/api/translate', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ 
                    text: term,
                    targetLanguage: targetLanguage,
                    context: "water culture term"
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.translation) {
                    translatedWord.innerHTML = `<strong>${term}</strong>: ${data.translation}`;
                    
                    // 获取详细解释
                    return fetch('/api/ai-answer', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ 
                            prompt: `Explain the term "${term}" in the context of Jiangxi water culture in 1-2 sentences.`,
                            language: getCurrentLanguage()
                        })
                    });
                } else {
                    aiExplanation.textContent = "Translation not available.";
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.answer) {
                    aiExplanation.textContent = data.answer;
                }
            })
            .catch(error => {
                aiExplanation.textContent = "Could not load explanation.";
            });
        });
    });
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
        "cultural": "文化的 (Related to culture and arts)",
        "Fushui": "抚水 (River in Jiangxi)",
        "dam": "水坝 (Water barrier structure)",
        "heritage": "遗产 (Cultural inheritance)",
        "flood": "洪水 (Water overflow)",
        "navigation": "航运 (Water transportation)",
        "engineering": "工程 (Technical application)"
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
    // document.querySelectorAll('.vocab-word').forEach(word => {
    //     word.addEventListener('click', function() {
    //         // 移除之前激活的词汇
    //         document.querySelectorAll('.vocab-word').forEach(w => {
    //             w.classList.remove('active');
    //         });
    //         // 添加当前激活状态
    //         this.classList.add('active');
    //         const term = this.dataset.word;
    //         translatedWord.innerHTML = `<strong>${term}</strong>: ${vocabDictionary[term]}`;
            
    //         // 显示AI解释
    //         aiExplanation.textContent = "Loading explanation...";
    //         vocabTranslator.classList.remove('hidden');
            
    //         // 获取AI解释
    //         fetch('/api/ai-answer', {
    //             method: 'POST',
    //             headers: {'Content-Type': 'application/json'},
    //             body: JSON.stringify({ 
    //                 prompt: `Explain the term "${term}" in the context of Jiangxi water culture in 1-2 sentences.`
    //             })
    //         })
    //         .then(response => response.json())
    //         .then(data => {
    //             if (data.answer) {
    //                 aiExplanation.textContent = data.answer;
    //             } else {
    //                 aiExplanation.textContent = "Could not load explanation.";
    //             }
    //         });
    //     });
    // });

    if (closeTranslator) {
        closeTranslator.addEventListener('click', () => {
            vocabTranslator.classList.add('hidden');
        });
    }

    // 修复Ask AI按钮事件
    if (askAiBtn) {
        askAiBtn.addEventListener('click', () => {
            const activeWord = document.querySelector('.vocab-word.active');
            if (activeWord) {
                const term = activeWord.dataset.word;
                aiChatbox.classList.remove('hidden');
                aiChatbox.classList.add('show');
                
                // 设置问题并触发发送
                aiQuestionInput.value = `请详细解释 ${term} 在江西水文化中的意义`;
                setTimeout(() => {
                    aiQuestionInput.focus();
                    sendQuestion();
                }, 300);
            }
        });
    }

    // 翻译游戏功能
    const gameOptions = document.querySelectorAll('.options button');
    const gameFeedback = document.getElementById('game-feedback');
    let correctAnswers = 0;
    const totalQuestions = document.querySelectorAll('.poem-excerpt').length;

    // 重置游戏状态函数
    function resetGame() {
        correctAnswers = 0;
        gameFeedback.classList.add('hidden');
        
        // 重置所有选项
        document.querySelectorAll('.options button').forEach(btn => {
            btn.disabled = false;
            btn.style.backgroundColor = '';
            btn.style.color = '';
        });
    }    
    // 在游戏开始时调用重置
    resetGame();

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
            if (correctAnswers === totalQuestions) {
                gameFeedback.classList.remove('hidden');
                gameFeedback.innerHTML = `
                    <div class="success-message">✓ 太棒了！您找到了所有翻译错误</div>
                    <p>汤显祖的诗歌捕捉了江西水文化的精髓。</p>
                    <button id="play-again">再玩一次</button>
                `;
                
                // 添加再玩一次按钮事件
                document.getElementById('play-again').addEventListener('click', resetGame);
            }
        });
    });


    // 知识检验功能
    const quizForm = document.getElementById('quiz-form');
    const quizResults = document.getElementById('quiz-results');

    if (quizForm) {
        quizForm.addEventListener('submit', function(e) {
            e.preventDefault();
    
            // 重置结果
            document.getElementById('mc-score').textContent = '0';
            document.getElementById('tf-score').textContent = '0';
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
            quizResults.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // 全景图控制
    const panLeftBtn = document.querySelector('.pan-left');
    const panRightBtn = document.querySelector('.pan-right');
    const panoramaImg = document.querySelector('.panorama-img');

    // 修复全景图控制逻辑
    if (panLeftBtn && panRightBtn && panoramaImg) {
        let panPosition = 0;
        let maxPan = 0;
        
        // 等待图片加载完成后再计算最大平移量
        panoramaImg.onload = function() {
            maxPan = this.width - this.parentElement.clientWidth;
        };
        
        // 如果图片已加载，立即计算
        if (panoramaImg.complete) {
            maxPan = panoramaImg.width - panoramaImg.parentElement.clientWidth;
        }
        
        panLeftBtn.addEventListener('click', () => {
            panPosition = Math.max(panPosition - 100, 0);
            panoramaImg.style.transform = `translateX(-${panPosition}px)`;
        });
        
        panRightBtn.addEventListener('click', () => {
            panPosition = Math.min(panPosition + 100, maxPan);
            panoramaImg.style.transform = `translateX(-${panPosition}px)`;
        });
    }


    loadChatHistory();
    // 设置首选语言
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && languageSelect) {
        languageSelect.value = savedLanguage;
}
    // 添加窗口大小变化时的处理
    window.addEventListener('resize', () => {
        // 调整AI聊天框位置
        if (!aiChatbox.classList.contains('hidden')) {
            const rect = aiChatbox.getBoundingClientRect();
            const maxX = window.innerWidth - aiChatbox.offsetWidth;
            const maxY = window.innerHeight - aiChatbox.offsetHeight;
            
            aiChatbox.style.left = `${Math.max(0, Math.min(parseInt(aiChatbox.style.left) || 0, maxX))}px`;
            aiChatbox.style.top = `${Math.max(0, Math.min(parseInt(aiChatbox.style.top) || 0, maxY))}px`;
        }
        
        // 重置全景图最大平移量
        if (panoramaImg) {
            maxPan = panoramaImg.width - panoramaImg.parentElement.clientWidth;
        }
    });

});

