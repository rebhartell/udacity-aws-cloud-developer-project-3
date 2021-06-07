#!/bin/bash

# load helper functions
source utils.sh 

menu() {

  banner "Aide Memoire"

  echo -ne "

  Select command:
    1) aws sts get-caller-identity
    2) aws eks list-clusters
    3) aws eks --region us-east-1 update-kubeconfig --name rebh-dev-eks-cluster
    4) cat ~/.kube/config
    5) kubectl get svc
    6) kubectl cluster-info
    7) kubectl get pods
    8) kubectl describe services
    a) kubectl logs <POD>
    b) kubectl exec -it <POD> /bin/bash
    c) kubectl get secrets
    d) kubectl describe secrets
    e) kubectl get secret <SECRET> -o jsonpath='{.data}'
    f) kubectl get configmap <CONFIGMAP> -o jsonpath='{.data}'
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
          aws eks --region us-east-1 update-kubeconfig --name rebh-dev-eks-cluster;;
      4)
          cat ~/.kube/config;;
      5)
          kubectl get svc;;
      6)
          kubectl cluster-info;;
      7)
          kubectl get pods;;
      8)
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
      *)
          exit;;
  esac

  echo ""
}

# main
while true; do

  menu

done