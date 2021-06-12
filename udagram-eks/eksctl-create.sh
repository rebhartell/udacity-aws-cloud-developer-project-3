#!/bin/bash

# load helper functions
source utils.sh 

# main
ask "eksctl create cluster?" N || exit 1
eksctl create cluster \
--name rebh-dev-eksctl-cluster \
--region us-east-1 \
--zones us-east-1a,us-east-1b,us-east-1c,us-east-1d,us-east-1f \
--nodegroup-name rebh-dev-eksctl-node-group \
--node-type t2.micro \
--with-oidc \
--ssh-access \
--ssh-public-key Udacity_Lab \
--managed
