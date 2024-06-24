import traceback
import requests
from flask import Flask, json, jsonify, redirect, request, make_response, url_for

from src.intent_handling.cadocs_intent import CadocsIntents
from src.intent_handling.intent_resolver import IntentResolver
from src.chatbot.intent_manager import IntentManager
from flask_cors import CORS, cross_origin

from src.service.cadocs_messages import build_message

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
app.config['CORS_HEADERS'] = 'Content-Type'

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


def resolve_utils(data: dict, lang: str):
    """
    Funzione che si occupa di risolvere un intent richiamando IntentResolver.
    """
    # se c'è il campo message
    if 'intent' not in data or 'entities' not in data:
        return jsonify({"error": "Invalid request: 'intent' and 'entities' fields required"}), 400

    try:
        resolver = IntentResolver()
        intent = build_intent(data['intent'])
        result = resolver.resolve_intent(intent, data['entities'])
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "An error occurred while resolving intent: " + str(e)}), 500

    return jsonify(build_message(result, build_intent(data['intent']), data['entities'], lang))


@app.route('/resolve_intent', methods=['POST'])
@cross_origin()
def resolve():
    """
    Funzione che si occupa di risolvere un intent richiamando IntentResolver.
    Parameters
    -----------
    data: json contenente il messaggio da analizzare che può essere di due tipi:
        {
            "message": "stringa del messaggio"
        }
        oppure
        {
            "entities": [
                {"number": 1000, "nationality": "Germany"},
                {"number": 1000, "nationality": "Italy"}
            ]
        }
    Returns
    -----------
    json: risultato dell'analisi del messaggio
    """

    try:
        data = request.get_json()

        # se c'è il campo message
        if 'message' in data:
            intent_manager = IntentManager()
            intent, entities, _, lang = intent_manager.detect_intent(data["message"])
            data = {"intent": intent.value, "entities": entities}
        else:
            # se non c'è message è probabilmente un geo-dispersion
            data = {"intent": "geodispersion", "entities": data['entities']}

    except:
        return jsonify({"error": "Invalid request: JSON required"}), 400

    print("STO PROCESSANDO RISPOSTA...")

    return resolve_utils(data, lang)
