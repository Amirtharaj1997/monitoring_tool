package com.programming.techie.fraudetect.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class FraudRecordRepository {

    private final JdbcClient jdbcClient;

    @Transactional(readOnly = true)
    public boolean existsByCustomerId(int customerId) {
        var sql = """
                SELECT COUNT(*) AS fraud__record_exists
                FROM fraud_records
                WHERE customerId = :customerId;
                """;
        return jdbcClient.sql(sql)
                .param("customerId", customerId)
                .query(Integer.class)
                .single() > 0;
    }

    @Transactional
    public Long save(int customerId) {
        var insertQuery = "INSERT INTO fraud_records (fraudRecordId, customerId) VALUES (?1, ?2)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcClient.sql(insertQuery)
                .param(1, UUID.randomUUID().toString())
                .param(2, customerId)
                .update();
        return keyHolder.getKeyAs(Long.class);
    }
}
