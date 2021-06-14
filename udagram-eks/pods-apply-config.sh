#!/bin/bash

# load helper functions
source utils.sh 

# main
ask "kubectl apply config?" N || exit 1

kubectl apply \
-f aws-secret.yaml \
-f env-secret.yaml \
-f env-configmap.yaml
