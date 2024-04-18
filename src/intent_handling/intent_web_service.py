from flask import Flask, jsonify, request, make_response
from intent_resolver import IntentResolver

app = Flask(__name__)

@app.route('/resolve_intent', methods=['POST'])
def resolve():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request: JSON required"}), 400

    if 'intent' not in data or 'entities' not in data:
        return jsonify({"error": "Invalid request: 'intent' and 'entities' fields required"}), 400

    try:
        resolver = IntentResolver()
        result = resolver.resolve_intent(data['intent'], data['entities'])
    except Exception as e:

        return jsonify({"error": "An error occurred while resolving intent: " + str(e)}), 500


    return result

if __name__ == '__main__':
    app.run(port=5000, debug=True)
