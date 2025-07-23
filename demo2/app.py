# core/app.py
from flask import Flask, render_template, jsonify, request
import requests
import time
import json
from googletrans import Translator


app = Flask(__name__)
DEEPSEEK_API_KEY = "sk-f5aa3e02b1c94e0899b9423b69ef6a48"

# 初始化翻译器
translator = Translator()

# 系统提示词模板
SYSTEM_PROMPT_TEMPLATES = {
    "en": "You are a helpful assistant specialized in Jiangxi water culture, Qianjinbei Dam, and Tang Xianzu's works. Provide detailed, accurate answers.",
    "zh": "您是一位专注于江西水文化、千金陂和汤显祖作品的助手。请提供详细准确的回答。",
    "es": "Eres un asistente especializado en la cultura del agua de Jiangxi, la presa Qianjinbei y las obras de Tang Xianzu. Proporciona respuestas detalladas y precisas.",
    "fr": "Vous êtes un assistant spécialisé dans la culture de l'eau du Jiangxi, le barrage de Qianjinbei et les œuvres de Tang Xianzu. Fournissez des réponses détaillées et précises."
}

# 水文化专业术语词典
WATER_CULTURE_GLOSSARY = {
    "Qianjinbei": {
        "en": "An ancient stone diversion dam built on the Fushui River in Jiangxi, known as the 'Dujiangyan of Jiangxi'",
        "zh": "江西抚水河上建造的古代石砌导流坝，被誉为'江西都江堰'",
        "es": "Una antigua presa de desvío de piedra construida en el río Fushui en Jiangxi, conocida como el 'Dujiangyan de Jiangxi'",
        "fr": "Un ancien barrage de dérivation en pierre construit sur la rivière Fushui dans le Jiangxi, connu sous le nom de 'Dujiangyan du Jiangxi'"
    },
    "Tang Xianzu": {
        "en": "Ming Dynasty playwright known for his 'Four Dreams of Linchuan', including 'The Peony Pavilion'",
        "zh": "明代剧作家，以'临川四梦'闻名，包括《牡丹亭》",
        "es": "Dramaturgo de la dinastía Ming conocido por sus 'Cuatro Sueños de Linchuan', incluido 'El Pabellón de las Peonías'",
        "fr": "Dramaturge de la dynastie Ming connu pour ses 'Quatre Rêves de Linchuan', dont 'Le Pavillon aux Pivoines'"
    },
    # 添加更多术语...
}

@app.route('/')
def index():
    return render_template('qianjinbei.html')

@app.route('/api/poem', methods=['GET'])
def generate_poem():
    # 简化的诗歌生成逻辑 - 实际可集成RiTa.js
    keywords = request.args.getlist('keywords')
    poem_lines = [
        "Where stone dams stand tall,",
        f"{' and '.join(keywords)} for all," if keywords else "Prosperity for all,",
        "Boats sail without fear -",
        "A hero's work shines here!"
    ]
    return jsonify({"poem": "\n".join(poem_lines)})

@app.route('/api/ai-answer', methods=['POST'])
def ai_answer():
    data = request.json
    prompt = data.get('prompt', '') if data else ''
    language = data.get('language', 'en') if data else 'en'
    context = data.get('context', '') if data else ''
    
    # 构建系统提示词
    system_prompt = SYSTEM_PROMPT_TEMPLATES.get(language, SYSTEM_PROMPT_TEMPLATES['en'])
    
    # 构建消息列表
    messages = [
        {"role": "system", "content": system_prompt}
    ]
    
    # 添加上下文（如果存在）
    if context:
        messages.append({"role": "user", "content": context})
    
    # 添加当前问题
    messages.append({"role": "user", "content": prompt})
    
    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "deepseek-chat",
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 1000
    }
    
    try:
        start_time = time.time()
        response = requests.post(
            "https://api.deepseek.com/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=60  # 增加超时时间
        )
        elapsed_time = time.time() - start_time
        
        if response.status_code == 200:
            result = response.json()
            answer = result['choices'][0]['message']['content']
            
            # 记录API使用情况
            app.logger.info(f"AI API call: {elapsed_time:.2f}s, Tokens: {result['usage']['total_tokens']}")
            
            return jsonify({
                "answer": answer
            })
        else:
            error_msg = f"API request failed: {response.status_code} - {response.text}"
            app.logger.error(error_msg)
            return jsonify({"error": error_msg}), 500
            
    except Exception as e:
        error_msg = f"API exception: {str(e)}"
        app.logger.exception(error_msg)
        return jsonify({"error": error_msg}), 500

@app.route('/api/test-connection', methods=['GET'])
def test_connection():
    """测试DeepSeek API连接"""
    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json"
    }
    
    try:
        # 发送一个简单的ping请求
        response = requests.get(
            "https://api.deepseek.com/v1/models",
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            return jsonify({
                "status": "success",
                "message": "API connection successful",
                "models": [model['id'] for model in response.json()['data']]
            })
        else:
            return jsonify({
                "status": "error",
                "message": f"API returned status {response.status_code}"
            }), 500
            
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Connection failed: {str(e)}"
        }), 500

@app.route('/api/translate', methods=['POST'])
def translate_text():
    """翻译文本端点"""
    data = request.json
    text = data.get('text', '') if data else ''
    target_language = data.get('targetLanguage', 'en') if data else 'en'
    context = data.get('context', '') if data else ''
    
    if not text:
        return jsonify({"error": "No text provided"}), 400
    
    try:
        # 检查是否是专业术语
        if text in WATER_CULTURE_GLOSSARY:
            translation = WATER_CULTURE_GLOSSARY[text].get(target_language, text)
            return jsonify({
                "translation": translation,
                "is_term": True
            })
        
        # 使用Google Translate API进行翻译
        result = translator.translate(text, dest=target_language)
        
        # 如果是水文化相关内容，优化翻译
        if context and ("water" in context.lower() or "culture" in context.lower()):
            # 调用AI优化翻译
            optimized = optimize_translation(text, result.text, target_language)
            return jsonify({
                "translation": optimized,
                "original": result.text,
                "is_optimized": True
            })
        
        return jsonify({"translation": result.text})
    
    except Exception as e:
        app.logger.error(f"Translation error: {str(e)}")
        return jsonify({"error": str(e)}), 500

def optimize_translation(original, translated, target_lang):
    """使用AI优化特定领域的翻译"""
    prompt = (
        f"Optimize the following translation for water culture context. "
        f"Original: '{original}'\n"
        f"Current translation: '{translated}'\n"
        f"Provide an improved version in {target_lang} that uses proper terminology for ancient Chinese water management systems."
    )
    
    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "deepseek-chat",
        "messages": [
            {
                "role": "system", 
                "content": "You are a professional translator specialized in ancient Chinese water management systems."
            },
            {
                "role": "user", 
                "content": prompt
            }
        ],
        "temperature": 0.3,
        "max_tokens": 200
    }
    
    try:
        response = requests.post(
            "https://api.deepseek.com/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            return response.json()['choices'][0]['message']['content'].strip()
        else:
            return translated  # 返回原始翻译
    
    except Exception:
        return translated  # 返回原始翻译

@app.route('/api/history', methods=['GET'])
def get_chat_history():
    """获取聊天历史（简化版，实际应用中应使用数据库）"""
    # 这里使用文件存储，实际应用中应使用数据库
    try:
        with open('chat_history.json', 'r') as f:
            history = json.load(f)
            return jsonify(history)
    except FileNotFoundError:
        return jsonify([])

@app.route('/api/save-history', methods=['POST'])
def save_chat_history():
    """保存聊天历史"""
    data = request.json
    if not data or not isinstance(data, list):
        return jsonify({"error": "Invalid data"}), 400
    
    try:
        # 只保留最近的50条记录
        if len(data) > 50:
            data = data[-50:]
        
        with open('chat_history.json', 'w') as f:
            json.dump(data, f)
        
        return jsonify({"status": "success"})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/sounds/flood_sound.mp3')
def flood_sound():
    """历史洪水音效文件（实际文件应放在static/sounds目录）"""
    # 实际应用中，应直接通过静态文件路径访问
    return app.send_static_file('sounds/flood_sound.mp3')

@app.route('/imgs/dam_structure.jpg')
def dam_structure():
    """砌石结构高清剖面图（实际文件应放在static/imgs目录）"""
    # 实际应用中，应直接通过静态文件路径访问
    return app.send_static_file('imgs/dam_structure.jpg')

if __name__ == '__main__':
    # 创建聊天历史文件（如果不存在）
    try:
        open('chat_history.json', 'a').close()
    except Exception:
        pass
    
    app.run(debug=True, port=5000)