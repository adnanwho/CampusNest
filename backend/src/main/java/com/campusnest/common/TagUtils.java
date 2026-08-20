package com.campusnest.common;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public final class TagUtils {

    private TagUtils() {}

    public static List<String> parseTags(String raw) {
        if (raw == null || raw.isBlank()) return Collections.emptyList();
        return Arrays.stream(raw.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    public static String joinTags(List<String> tags) {
        if (tags == null || tags.isEmpty()) return "";
        return String.join(",", tags);
    }
}
