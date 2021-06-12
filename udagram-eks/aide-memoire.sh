#!/bin/bash

# load helper functions
source utils.sh 

menu() {

  banner "Aide Memoire"

  echo -ne "

  Select command:
    1) aws sts get-caller-identity
    2) aws eks list-clusters
    3) aws eks list-nodegroups --cluster-name <CLUSTER>
    4) aws eks --region us-east-1 update-kubeconfig --name <CLUSTER>
    5) cat ~/.kube/config
    6) kubectl get svc
    7) kubectl cluster-info
    8) kubectl get pods
    9) kubectl describe services
    a) kubectl logs <POD>
    b) kubectl exec -it <POD> /bin/bash
    c) kubectl get secrets
    d) kubectl describe secrets
    e) kubectl get secret <SECRET> -o jsonpath='{.data}'
    f) kubectl get configmap <CONFIGMAP> -o jsonpath='{.data}'
    g) aws eks delete-cluster --name <CLUSTER>
    h) aws eks delete-nodegroup --cluster-name <CLUSTER> --nodegroup-name <NODE-GROUP>
    *) exit
  "

  read ans

  echo ""

  case $ans in
      1)
          aws sts get-caller-identity;;
      2)
          aws eks list-clusters;;
      3)
          echo "aws eks list-nodegroups  --cluster-name <CLUSTER>";;
      4)
          echo "aws eks --region us-east-1 update-kubeconfig --name <CLUSTER>";;
      5)
          cat ~/.kube/config;;
      6)
          kubectl get svc;;
      7)
          kubectl cluster-info;;
      8)
          kubectl get pods;;
      9)
          kubectl describe services;;
      a)
          echo "kubectl logs <POD>";;
      b)
          echo "kubectl exec -it <POD> /bin/bash";;
      c)
          kubectl get secrets;;
      d)
          kubectl describe secrets;;
      e)
          echo "kubectl get secret <SECRET> -o jsonpath='{.data}'";;        
      f)
          echo "kubectl get configmap <CONFIGMAP> -o jsonpath='{.data}'";;        
      g)
          echo "aws eks delete-cluster --name <CLUSTER>";;
      h)
          echo "aws eks delete-nodegroup --cluster-name <CLUSTER> --nodegroup-name <NODE-GROUP>";;
      *)
          exit;;

  esac

  echo ""
}

# main
while true; do

  menu

done