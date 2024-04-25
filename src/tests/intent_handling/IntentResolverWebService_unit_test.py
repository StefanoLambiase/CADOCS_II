import pytest
from unittest.mock import patch
from src.intent_handling.intent_resolver import IntentResolver
from src.intent_handling.intent_web_service import app

risultato_atteso_success = {'Index': 0, 'StartingDate': '12/22/2022',
                            'Smell1': ['BCE', 'Black-cloud Effect'],
                            'Smell2': ['PDE', 'Prima-donnas Effect'],
                            'Smell3': ['RS', 'Radio Silence'],
                            'Smell4': ['UI', 'Unhealthy Interaction'],
                            'Smell5': ['TC', 'Toxic Communication']}


class TestIntentResolverWebService:
    @pytest.fixture()
    def client(self):
        """
        Fixture che restituisce un client mockato
        """
        with app.test_client() as client:
            with app.app_context():
                yield client

    def test_missing_data(self, client):
        """
        Test che si assicura che se viene inviata una request vuota viene lanciata un'eccezione

        Parameters
        ---------------
        client : flask app context
        """
        response = client.post('/resolve_intent')
        assert response.status_code == 400

    def test_missing_intent(self, client):
        """
        Test che si assicura che se viene inviata una request con solo entities allora viene restituito errore 400

        Parameters
        ---------------
        client : flask app context
        """
        request_content = {
            'entities': ["https://www.github.com/gianwario/BeeHave"]
        }
        response = client.post('/resolve_intent', json=request_content)
        assert response.status_code == 400

    def test_missing_entities(self, client):
        """
        Test che si assicura che se viene inviata una request con solo intent allora viene restituito errore 400

        Parameters
        ---------------
        client : flask app context
        """

        request_content = {
            'intent': "GET_SMELL"
        }
        response = client.post('/resolve_intent', json=request_content)
        assert response.status_code == 400

    def test_resolver_exception_handling(self, client):
        """
        Test che simula un'eccezione nel modulo IntentResolverWebService

        Parameters
        ---------------
        client : flask app context
        """
        with patch.object(IntentResolver, 'resolve_intent', side_effect=Exception('Simulated error')):
            request_content = {
                'intent': "get_smells",
                'entities': ["https://www.github.com/gianwario/BeeHave"]
            }

            response = client.post('/resolve_intent', json=request_content)
            assert response.status_code == 500
            assert b"An error occurred while resolving intent: Simulated error" in response.data

    def test_resolve_success(self, client):
        """
        Test che si assicura che se vengono inviati i giusti dati non vengono lanciate eccezioni

        Parameters
        ---------------
        client : flask app context
        """
        with patch.object(IntentResolver, 'resolve_intent', return_value=risultato_atteso_success) as mock_method:
            request_content = {
                'intent': "get_smells",
                'entities': ["https://www.github.com/gianwario/BeeHave"]
            }

            response = client.post('/resolve_intent', json=request_content)
            assert response.status_code == 200
