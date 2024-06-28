import os
from unittest import mock
from unittest.mock import patch

import pytest
from src.intent_handling.tools import CultureInspectorTool
from dotenv import load_dotenv, find_dotenv

class TestCultureInspectorUnit:
    
    @pytest.fixture()
    def inspector(self):
        load_dotenv(find_dotenv('.env'))
        
        inspector = CultureInspectorTool()
        yield inspector

    def test_check_list_null(self, inspector):
        data = []
        data = inspector.execute_tool(data)
        assert data == ["the list of developers is not well formed","500"]

    def test_check_list_format(self, inspector):
        data = {"number": 1000}
        result = inspector.execute_tool(data)
        assert result == ["the list of developers is not well formed","500"]


    def test_success(self, inspector):
        data = {"number": 1000, "nationality": "Germany"}

        with patch('requests.post') as mock_post:
            # Definisci il risultato del mockn
            mock_post.return_value.json.return_value = {
                "idv": 11.018476844566461,
                "ind": 2.0,
                "lto": 5.0,
                "mas": 11.955627250395782,
                "pdi": 13.118079804840942,
                "uai": 10.497231933093088,
                "null_values": {
                    "Panama": [
                        "lto",
                        "ind"
                    ]
                }
            }
            result = inspector.execute_tool(data)
            #get the url from the .env file
            url = os.environ.get('GEODISPERSION_URL')
            mock_post.assert_called_once_with(url, json=data)

            # Verifica che il risultato sia un dizionario con i campi previsti
            assert isinstance(result, dict)
            assert "idv" in result
            assert "ind" in result
            assert "lto" in result
            assert "mas" in result
            assert "pdi" in result
            assert "uai" in result
            assert "null_values" in result