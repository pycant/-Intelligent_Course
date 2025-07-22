# core/app.py
from flask import Flask, render_template, jsonify, request


app = Flask(__name__)

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

if __name__ == '__main__':
    app.run(debug=True)