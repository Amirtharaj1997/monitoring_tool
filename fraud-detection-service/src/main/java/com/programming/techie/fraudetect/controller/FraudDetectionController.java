package com.programming.techie.fraudetect.controller;

import com.programming.techie.fraudetect.entity.LoanStatus;
import com.programming.techie.fraudetect.service.FraudDetectionService;
import com.programming.techie.fraudetect.service.KafkaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/fraud")
@RequiredArgsConstructor
@Slf4j
public class FraudDetectionController {

    private final FraudDetectionService fraudDetectionService;
    private final KafkaService kafkaService;

    @GetMapping("/check")
    public LoanStatus checkForFraud(@RequestParam int customerId) {
        log.info("Checking for fraud for customer id: {}", customerId);
        LoanStatus loanStatus = fraudDetectionService.checkForFraud(customerId);
        if(loanStatus.equals(LoanStatus.APPROVED)) {
            kafkaService.sendMessage(String.valueOf(customerId));
        }
        return loanStatus;
    }
}
