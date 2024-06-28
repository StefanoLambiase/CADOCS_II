from src.intent_handling.tools import CsDetectorTool
import requests
from unittest.mock import mock_open, patch, MagicMock
import pytest
import os

class TestCsDetectorToolUT:

    @pytest.fixture
    def cs_tool_instance(self):
        cs_tool = CsDetectorTool()
        yield cs_tool

    @pytest.mark.parametrize("data, files", [
        (["repo", "data", "date"], ["commitCentrality_0.pdf",
         "Issues_0.pdf", "issuesAndPRsCentrality_0.pdf", "PRs_0.pdf"]),
        (["repo", "data"], ["commitCentrality_0.pdf", "Issues_0.pdf",
         "issuesAndPRsCentrality_0.pdf", "PRs_0.pdf"]),
        (["repo", "data"], [])
    ])
    def test_execute_tool_w_date(self, cs_tool_instance, mocker, data, files):
        response = {
            "files": files,
            "result": [
                "test",
                "response"
            ]
        }

        # Mock the environment variable
        mocker.patch('os.environ.get', return_value="CSDETECTOR_URL_GETSMELLS")

        # Mock the Response object
        mock_response = MagicMock(spec=requests.Response)
        mock_response.json.return_value = response
        mock_response.status_code = 200

        # Patch the requests.get method
        mocker.patch("requests.get", return_value=mock_response)

        # Mock the open method
        with patch("builtins.open", mock_open()) as mock_file:
            # Execute the tool
            result = cs_tool_instance.execute_tool(data)
            # Assertions
            assert result == ["response"]

if __name__ == "__main__":
    pytest.main()