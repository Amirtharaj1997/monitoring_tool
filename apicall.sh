#!/bin/sh

#For generating topology 10 times hit the api

i=0

while [ $i -lt 10 ]
do
   echo $i
   curl --location 'http://'$(minikube ip)':30001/loan' \
   --header 'Content-Type: application/json' \
   --data '{
           "customerName": "AMIRTHARAJ",
           "customerId": 101,
           "amount": 1000.00,
           "currency": "USD"
   }'
   echo 'api request send ' $i
   # shellcheck disable=SC2006
   i=`expr $i + 1`
done