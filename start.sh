#!/bin/sh
JAVA_HOME=/home/raj-19513/jdk_11/jdk-17.0.12
mvn --version
# Integration part
helm uninstall prometheus
kubectl delete all --all
docker rmi loan-service
docker rmi fraud-service
docker rmi alert-node
rm -rf fraud-detection-service/target
rm -rf loan-service/target
# shellcheck disable=SC2046
eval $(minikube docker-env)
mvn -f fraud-detection-service/pom.xml clean install -DskipTests
mvn -f loan-service/pom.xml clean install -DskipTests
docker build -t fraud-service fraud-detection-service/.
docker build -t loan-service loan-service/.
docker build -t alert-node alert-node/.




# $Id$
#prometheus-community chart setup
# k8s Deployment part
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install prometheus prometheus-community/kube-prometheus-stack -f helm/promo-grafana.yml

# SETUP
# loan-service,
# fraud-detection service,
# mysql db,
# alert service (site24x7 going to replace this)
kubectl apply -f deployments/