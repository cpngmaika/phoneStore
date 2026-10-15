package com.example.server.util;

import com.example.server.dto.coupon.CouponResponse;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertTrue;

class JsonUtilTest {

    @Test
    void serializesLocalDatesAsIsoStrings() throws Exception {
        CouponResponse coupon = new CouponResponse();
        coupon.setStartDate(LocalDate.of(2026, 10, 15));
        coupon.setEndDate(LocalDate.of(2026, 10, 31));

        String json = JsonUtil.toJson(coupon);

        assertTrue(json.contains("\"startDate\":\"2026-10-15\""));
        assertTrue(json.contains("\"endDate\":\"2026-10-31\""));
    }
}
