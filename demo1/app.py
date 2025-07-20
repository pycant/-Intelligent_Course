# core/app.py
from flask import Flask, render_template, jsonify

app = Flask(__name__)

# 万寿宫建筑数据
wan_shou_gong = {
    "layout": [
        {"id": "main_hall", "name": "正殿", "desc": "许真君主神殿，始建于东晋"},
        {"id": "opera_stage", "name": "戏台", "desc": "庙会时表演酬神戏剧"},
        {"id": "incense_burner", "name": "香炉", "desc": "信徒焚香祈福之处"}
    ],
    "history": {
        "modern": "现代万寿宫全景（2023年修复后）",
        "qing_dynasty": "清代万寿宫复原图（1845年《西山宫志》记载）"
    }
}

# 祭祀活动数据
rituals = {
    "offerings": [
        {"id": "wine", "name": "酒", "meaning": "敬献神明，象征虔诚"},
        {"id": "grain", "name": "谷物", "meaning": "祈求五谷丰登，呼应治水护农"},
        {"id": "silk", "name": "丝绸", "meaning": "代表富贵吉祥"}
    ],
    "procedures": [
        {"id": "music", "name": "献乐", "content": "演奏道教祭祀乐曲《步虚韵》"},
        {"id": "kowtow", "name": "跪拜", "content": "一跪三叩，念诵：'仰祈真君，福佑江右'"}
    ]
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/map')
def temple_map():
    return render_template('map.html', data=wan_shou_gong)

@app.route('/ritual')
def ritual():
    return render_template('ritual.html', data=rituals)

@app.route('/get_building/<building_id>')
def get_building(building_id):
    building = next((b for b in wan_shou_gong['layout'] if b['id'] == building_id), None)
    return jsonify(building) if building else ("Not found", 404)

@app.route('/get_offering/<offering_id>')
def get_offering(offering_id):
    offering = next((o for o in rituals['offerings'] if o['id'] == offering_id), None)
    return jsonify(offering) if offering else ("Not found", 404)

if __name__ == '__main__':
    app.run(debug=True)