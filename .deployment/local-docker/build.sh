#!/bin/bash
BASEDIR=$(dirname "$1")

# Build docker images
docker build -t pp-pairing-back ./backend/services/pp-pairing/pp-pairing-back/
docker build -t pp-pairing-front ./backend/services/pp-pairing/pp-pairing-front/
