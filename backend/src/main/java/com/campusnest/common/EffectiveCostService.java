package com.campusnest.common;

import com.campusnest.model.Property;
import org.springframework.stereotype.Service;

@Service
public class EffectiveCostService {

    public int calculate(Property property) {
        return calculate(
                property.getRent(),
                property.getFoodCost(),
                property.getElectricityCost(),
                property.getWifiCost(),
                property.getMaintenanceCost()
        );
    }

    public int calculate(int rent, int food, int electricity, int wifi, int maintenance) {
        return rent + food + electricity + wifi + maintenance;
    }
}
