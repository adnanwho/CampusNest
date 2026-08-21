package com.campusnest.common;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

class EffectiveCostServiceTest {

    private final EffectiveCostService effectiveCostService = new EffectiveCostService();

    @Test
    void addsMonthlyCostComponentsAndExcludesDeposit() {
        assertEquals(9650, effectiveCostService.calculate(7000, 900, 250, 400, 1100));
    }
}