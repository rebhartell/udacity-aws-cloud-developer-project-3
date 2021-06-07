#!/bin/bash

# load helper functions
source utils.sh 

# main
ask "eksctl create cluster?" N || exit 1
eksctl create cluster \
--name rebh-dev-eks-1 \
--region us-east-1 \
--zones us-east-1a,us-east-1b,us-east-1c,us-east-1d,us-east-1f \
--with-oidc \
--ssh-access \
--ssh-public-key Udacity_Lab \
--managed \
--instance-types t2.micro
