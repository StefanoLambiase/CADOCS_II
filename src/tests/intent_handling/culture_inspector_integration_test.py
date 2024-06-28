import pytest
from src.intent_handling.tools import CultureInspectorTool
from dotenv import load_dotenv, find_dotenv
class TestCultureInspectorIntegration:
    @pytest.fixture()
    def setUp(self):
        inspector = CultureInspectorTool()
        #load environment variables
        #se non c'è il file .env nella cartella src, il test fallisce con messaggio di errore
        load_dotenv(find_dotenv('.env'))
        
        yield inspector

    def test_check_list_null(self, setUp):
        """
        Test che verifica il comportamento con una lista vuota
        """
        data = []
        result = setUp.execute_tool(data)
        assert result == ["the list of developers is not well formed", "500"]

    def test_check_list_format(self, setUp):
        """
        Test che verifica il comportamento con dati malformati
        """
        data = {"number": 1000}
        result = setUp.execute_tool(data)
        assert result == ["the list of developers is not well formed", "500"]

    def test_success(self, setUp):
        """
        Test che verifica il comportamento con dati corretti
        """
        data = [
            {"number": 20, "nationality": "Germany"},
            {"number": 10, "nationality": "Italy"},
            {"number": 5, "nationality": "Spain"}
        ]
        result = setUp.execute_tool(data)


        # Verifica che il risultato sia un dizionario con i campi previsti
        assert isinstance(result, dict)
        assert "idv" in result
        assert "ind" in result
        assert "lto" in result
        assert "mas" in result
        assert "pdi" in result
        assert "uai" in result
        assert "null_values" in result
