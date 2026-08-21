package com.campusnest.common;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

import com.campusnest.model.AvailabilityStatus;
import com.campusnest.model.Property;

class AvailabilityServiceTest {

    private final AvailabilityService availabilityService = new AvailabilityService();

    @Test
    void computesAvailabilityStatusFromRemainingCapacity() {
        assertEquals(AvailabilityStatus.AVAILABLE, availabilityService.computeStatus(2, 10));
        assertEquals(AvailabilityStatus.FILLING_FAST, availabilityService.computeStatus(6, 10));
        assertEquals(AvailabilityStatus.ALMOST_FULL, availabilityService.computeStatus(9, 10));
        assertEquals(AvailabilityStatus.FULL, availabilityService.computeStatus(10, 10));
    }

    @Test
    void treatsInvalidCapacityAsFullAndClampsAvailableBeds() {
        assertEquals(AvailabilityStatus.FULL, availabilityService.computeStatus(0, 0));
        Property property = Property.builder().capacity(4).occupied(7).build();

        availabilityService.refreshAvailability(property);

        assertEquals(0, property.getAvailable());
    }
}