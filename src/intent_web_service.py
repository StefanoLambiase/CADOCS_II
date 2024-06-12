import traceback
import requests
from flask import Flask, json, jsonify, redirect, request, make_response, url_for

from src.intent_handling.cadocs_intent import CadocsIntents
from src.intent_handling.intent_resolver import IntentResolver
from src.chatbot.intent_manager import IntentManager
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

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

@app.route("/resolve_chatbot_intent", methods=["POST"])
def resolve_chatbot_intent():
    """
    Funzione che si occupa di risolvere l'intent del chatbot.

    Parameters
    -----------

    Returns
    -----------
    intent: intent del chatbot
    result: risultato dell'operazione
    entities: entità rilevate
    lang: lingua del messaggio
    "CADOCS": nome del tool

    Raises
    -----------
    Exception

    """
    intent_manager = IntentManager()
    intent, entities, _, _ = intent_manager.detect_intent(request.json["message"])
    print("Messaggio" + request.json["message"])
    if entities:
        data = {"intent": intent.value, "entities": entities}


        #redirect to the resolve_intent route
        result = resolve_utils(data)

    return result


def resolve_utils(data:dict):
    """
    Funzione che si occupa di risolvere un intent richiamando IntentResolver.
    """

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

    return resolve_utils(data)


