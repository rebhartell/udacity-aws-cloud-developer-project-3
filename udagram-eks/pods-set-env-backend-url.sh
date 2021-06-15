#!/bin/bash

# load helper functions
source utils.sh 

# the new frontend URL (External IP)
FRONTEND_URL=http://a9f965b7d549f42ad81c65ae78fafce4-1622013890.us-east-1.elb.amazonaws.com:8100

# main
ask "kubectl set env URL=${FRONTEND_URL} for backend?" N || exit 1

kubectl set env deployment udagram-api-feed URL="${FRONTEND_URL}"

kubectl set env deployment udagram-api-user URL="${FRONTEND_URL}"
