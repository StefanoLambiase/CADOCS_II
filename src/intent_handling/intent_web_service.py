import traceback

from flask import Flask, jsonify, request, make_response

from src.intent_handling.cadocs_intent import CadocsIntents
from src.intent_handling.intent_resolver import IntentResolver

app = Flask(__name__)


def build_intent(intent_value: str) -> CadocsIntents:
    """
    Funzione che restituisce l'intent legato al valore.
    L'esigenza di tale funzione nasce dal fatto che una enum (CadocsIntents) non è serializzabile
    dunque si deve passare il valore dell'enum alle nostre API.

    Parameters
    -----------
    intent_value: value che viene passato dal client

    Returns
    -----------
    CadocsIntents: intent corrispondente al valore stringa input

    Raises
    -----------
    ValueError: viene sollevata un'eccezione nel momento in cui si passa una stringa che non corrisponde ad alcun intent
    """
    for intent in CadocsIntents:
        if intent_value == intent.value:
            return intent

    raise ValueError(f"Unknown intent: {intent_value}")


@app.route('/resolve_intent', methods=['POST'])
def resolve():
    """
    Route che si occupa di risolvere un intent richiamando IntentResolver.

    Parameters
    -----------

    Returns
    -----------
    result: output del tool legato all'intent

    Raises
    -----------
    Exception
    """
    try:
        data = request.get_json()
    except:
        return jsonify({"error": "Invalid request: JSON required"}), 400

    if 'intent' not in data or 'entities' not in data:
        return jsonify({"error": "Invalid request: 'intent' and 'entities' fields required"}), 400

    try:
        resolver = IntentResolver()
        intent = build_intent(data['intent'])
        result = resolver.resolve_intent(intent, data['entities'])
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "An error occurred while resolving intent: " + str(e)}), 500

    return result


if __name__ == '__main__':
    app.run(port=5000, debug=True)
