#!/bin/bash

exec python3.8 csDetectorWebService.py &
exec python3.8 culture-inspector/runner.py &
exec python3.8 CADOCS_II/runner.py