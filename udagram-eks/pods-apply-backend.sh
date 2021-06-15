#!/bin/bash

# load helper functions
source utils.sh 

# main
ask "kubectl apply backend?" N || exit 1

kubectl apply \
-f udagram-api-feed-deployment.yaml \
-f udagram-api-feed-service.yaml \
-f udagram-api-user-deployment.yaml \
-f udagram-api-user-service.yaml \
-f udagram-reverseproxy-deployment.yaml \
-f udagram-reverseproxy-service.yaml
