from typing import List
from src.intent_handling.tool_strategy import Tool
import os
import requests
from dotenv import load_dotenv

load_dotenv('src/.env')


# this is a concrete strategy that implements the abstract one, so that we can have multiple
class CsDetectorTool(Tool):
    last_repo = ""

    def execute_tool(self, data: List):
        print("\n\n\nSono in execute tool", data)
        print("\n\n\n")
        # if we have 2 entities (repo and date), we execute the tool with date parameter
        if data.__len__() >= 2:
            req = requests.get(
                os.environ.get('CSDETECTOR_URL_GETSMELLS') + '?repo=' + data[0] + '&pat=' + os.environ.get('PAT',
                                                                                                           "") + "&start=" +
                data[1])
        else:
            req = requests.get(
                os.environ.get('CSDETECTOR_URL_GETSMELLS') + '?repo=' + data[0] + '&pat=' + os.environ.get('PAT',
                                                                                                           ""))  # +'&user='+data[data.__len__()-1]+"&graphs=True"

        # req.raise_for_status()
        response_json = req.json()

        if req.status_code == 890:
            error_text = response_json.get('error')
            code = response_json.get('code')
            results = [error_text, code]
            print("\n\nRESULTATO\n\n", results)
            return results

        print("\n\n\nStampa risposta", req.json())
        print("\n\n\n")
        # we retrieve the file names created by csdetector
        results = req.json().get("result")[1:]
        return results


def check_list_format(lst: List) -> bool:
    """
        Checks if the provided data list is formatted correctly according to the expected structure.

        :param lst: List of dictionaries where each dictionary is built like this:
                    {"number": 1000, "nationality": "Germany"}
        :return: True if the data list is formatted correctly, False otherwise.
        """
    # Check if the list is empty
    if not lst:
        return False

    # Controlla se ogni elemento della lista è un dizionario con le chiavi 'number' e 'nationality'
    for item in lst:
        if not isinstance(item, dict) or 'number' not in item or 'nationality' not in item:
            return False

    return True


class CultureInspectorTool(Tool):
    """
    CultureInspectorTools implements one of the concrete strategies
    within the strategy design pattern.
    This specific strategy enables users to utilize
    the geodispersion inspector for computing
    the cultural geodispersion metrics of their team.
    """
    def execute_tool(self, data: List):
        """
        Executes the CultureInspector tool by calling its webservice.
        :param data: List of dictionaries where each dictionary is built like this:
                {"number": 1000, "nationality": "Germany"}
        :return: A json with the hofstede metrics computed by the CultureInspector tool.
                e.g. {
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
                or if the data is not formatted correctly:
                ["the list of developers is not well formed", code = "500"]
        """
        if check_list_format(data):
            req = requests.post(os.environ.get('GEODISPERSION_URL'), json=data)
            result = req.json()
        else:
            error_text = "the list of developers is not well formed"
            code = "500"
            result = [error_text, code]

        return result

