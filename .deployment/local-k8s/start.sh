#!/bin/bash
kubectl delete secret peerprep-secret
kubectl create secret generic peerprep-secret --from-env-file=.env
# kubectl apply -f k8-templates
