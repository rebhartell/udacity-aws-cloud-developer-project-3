#!/bin/bash

# load helper functions
source utils.sh 

# config
AWS_CLUSTER=rebh-dev-eks-cluster
AWS_NODE_GROUP=rebh-dev-eks-node-group
AWS_POD="<POD>"
AWS_SECRET=aws-secret
AWS_CONFIGMAP=env-configmap


menu() {

  echo -n "

  Select command:
    1) aws sts get-caller-identity
    2) aws eks list-clusters
    3) aws eks list-nodegroups --cluster-name ${AWS_CLUSTER}
    4) aws eks --region us-east-1 update-kubeconfig --name ${AWS_CLUSTER}
    5) cat ~/.kube/config
    6) kubectl get svc
    7) kubectl cluster-info
    8) kubectl get pods
    9) kubectl describe services
    a) kubectl logs ${AWS_POD}
    b) kubectl exec -it ${AWS_POD} /bin/bash
    c) kubectl get secrets
    d) kubectl describe secrets
    e) kubectl get secret ${AWS_SECRET} -o jsonpath='{.data}'
    f) kubectl get configmap
    g) kubectl get configmap ${AWS_CONFIGMAP} -o jsonpath='{.data}'
    h) aws eks delete-cluster --name ${AWS_CLUSTER}
    i) aws eks delete-nodegroup --cluster-name ${AWS_CLUSTER} --nodegroup-name ${AWS_NODE_GROUP}
    x) exit
    *) show this menu
  
  "

}


menuOption() {

  echo -ne "Select option: "

  read ans

  case $ans in
      1)
          aws sts get-caller-identity;;
      2)
          aws eks list-clusters;;
      3)
          aws eks list-nodegroups  --cluster-name ${AWS_CLUSTER};;
      4)
          aws eks --region us-east-1 update-kubeconfig --name ${AWS_CLUSTER};;
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
          kubectl logs ${POD};;
      b)
          kubectl exec -it ${POD} /bin/bash;;
      c)
          kubectl get secrets;;
      d)
          kubectl describe secrets;;
      e)
          kubectl get secret ${SECRET} -o jsonpath='{.data}';;        
      f)
          kubectl get configmap;;
      g)
          kubectl get configmap ${CONFIGMAP} -o jsonpath='{.data}';;        
      h)
          echo "aws eks delete-cluster --name ${AWS_CLUSTER}";;
      i)
          echo "aws eks delete-nodegroup --cluster-name ${AWS_CLUSTER} --nodegroup-name ${AWS_NODE_GROUP}";;
      x)
          exit;;
      *)
          menu;;

  esac

  echo ""
}


# main
banner "Aide Memoire"

menu

while true; do

  menuOption

done