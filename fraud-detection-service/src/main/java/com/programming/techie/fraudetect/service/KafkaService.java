package com.programming.techie.fraudetect.service;

import com.programming.techie.fraudetect.repository.FraudRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.UUID;

@Service
public class KafkaService {

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private FraudRecordRepository fraudRecordRepository;

    private static final String TOPIC = "my-topic";

    public void sendMessage(String message) {
        kafkaTemplate.send(TOPIC, message);
    }

    @KafkaListener(topics = "my-topic", groupId = "my-group")
    public void consume(String message) {
        try {
            System.out.println("Received message: " + message);
            int customerId = Integer.parseInt(message);
            fraudRecordRepository.save(customerId);
        } catch (Exception exception) {
            System.out.println("exception occurred " + Arrays.toString(exception.getStackTrace()));
        }
    }

}

