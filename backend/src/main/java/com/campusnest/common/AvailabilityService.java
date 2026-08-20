package com.campusnest.common;

import com.campusnest.model.AvailabilityStatus;
import com.campusnest.model.Property;
import org.springframework.stereotype.Service;

@Service
public class AvailabilityService {

    public AvailabilityStatus computeStatus(int occupied, int capacity) {
        if (capacity <= 0) return AvailabilityStatus.FULL;
        int available = Math.max(0, capacity - occupied);
        if (available == 0) return AvailabilityStatus.FULL;
        double ratio = (double) available / capacity;
        if (ratio > 0.5) return AvailabilityStatus.AVAILABLE;
        if (ratio > 0.25) return AvailabilityStatus.FILLING_FAST;
        return AvailabilityStatus.ALMOST_FULL;
    }

    public void refreshAvailability(Property property) {
        int available = Math.max(0, property.getCapacity() - property.getOccupied());
        property.setAvailable(available);
    }
}
