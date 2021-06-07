#!/bin/bash

# load helper functions
source utils.sh 

# main
ask "Upload the secrets and configmap?" Y || exit 1
kubectl apply -f aws-secret.yaml
kubectl apply -f env-secret.yaml
kubectl apply -f env-configmap.yaml

ask "Deploy udagram-api-feed?" Y || exit 1
kubectl apply -f udagram-api-feed-deployment.yaml
kubectl apply -f udagram-api-feed-service.yaml

ask "Deploy udagram-api-user?" Y || exit 1
kubectl apply -f udagram-api-user-deployment.yaml
kubectl apply -f udagram-api-user-service.yaml

ask "Deploy udagram-reverseproxy?" Y || exit 1
kubectl apply -f udagram-reverseproxy-deployment.yaml
kubectl apply -f udagram-reverseproxy-service.yaml

ask "Deploy udagram-frontend?" Y || exit 1
kubectl apply -f udagram-frontend-deployment.yaml
kubectl apply -f udagram-frontend-service.yaml
