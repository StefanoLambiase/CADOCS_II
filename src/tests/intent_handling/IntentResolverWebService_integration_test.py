from dotenv import find_dotenv, load_dotenv
import pytest
from src.intent_web_service import app


class TestIntentResolverIntegration:
    
    @pytest.fixture()
    def client(self):
        load_dotenv(find_dotenv('.env'))
        app.config['TESTING'] = True
        with app.test_client() as client:
            yield client

    def test_resolve_intent_with_message(self, client):
        response = client.post('/resolve_intent', json={
            "message": "hey cadocs can you find me some smells in https://github.com/gianwario/beehave ?"
        })
        assert response.status_code == 200

    def test_resolve_intent_with_entities(self, client):
        response = client.post('/resolve_intent', json={
            "entities": [
                {"number": 1000, "nationality": "Germany"},
                {"number": 1000, "nationality": "Italy"}
            ]
        })
        assert response.status_code == 200
        data = response.get_json()
        assert "idv" in data

    def test_resolve_intent_invalid_request(self, client):
        response = client.post('/resolve_intent', json={})
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data

    def test_resolve_intent_exception(self, client, mocker):
        mock_intent_manager = mocker.patch('src.intent_web_service.IntentManager')
        mock_intent_manager_instance = mock_intent_manager.return_value
        mock_intent_manager_instance.detect_intent.side_effect = Exception("Intent detection error")

        response = client.post('/resolve_intent', json={
            "message": "test message"
        })
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
