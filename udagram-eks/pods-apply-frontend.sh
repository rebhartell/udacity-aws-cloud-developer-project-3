#!/bin/bash

# load helper functions
source utils.sh 

# main
ask "kubectl apply frontend?" N || exit 1

kubectl apply \
-f udagram-frontend-deployment.yaml \
-f udagram-frontend-service.yaml 
