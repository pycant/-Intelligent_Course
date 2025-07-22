# core/app.py
from flask import Flask, render_template, jsonify, request
import requests

app = Flask(__name__)
DEEPSEEK_API_KEY = "sk-f5aa3e02b1c94e0899b9423b69ef6a48"

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
    
    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant specialized in Jiangxi water culture and Tang Xianzu's works. Provide detailed, accurate answers in English."},
            {"role": "user", "content": prompt}
        ]
    }
    
    try:
        response = requests.post(
            "https://api.deepseek.com/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            return jsonify({
                "answer": response.json()['choices'][0]['message']['content']
            })
        else:
            return jsonify({"error": "API request failed"}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)