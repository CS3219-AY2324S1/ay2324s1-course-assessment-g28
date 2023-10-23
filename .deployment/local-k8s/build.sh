#!/bin/bash
cd "$(dirname "$0")"
cd ../..

docker build -t peerprep/frontend ./frontend/
docker build -t peerprep/user ./backend/services/user/
docker build -t peerprep/question ./backend/services/question/
docker build -t peerprep/pairing-front ./backend/services/pairing/pairing-front/
docker build -t peerprep/pairing-back ./backend/services/pairing/pairing-back/
