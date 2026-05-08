package com.example.Backend_2026.emuns;

import java.util.Arrays;

public enum TrangThaiHoaDon {

    CHO_XAC_NHAN(0),
    DA_XAC_NHAN(1),
    DANG_GIAO(2),
    HOAN_THANH(3),
    DA_HUY(4),
    TRA_HANG(5);

    private final int value;

    TrangThaiHoaDon(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    // convert từ int -> enum (an toàn hơn)
    public static TrangThaiHoaDon fromValue(Integer value) {
        if (value == null) return CHO_XAC_NHAN;

        return Arrays.stream(values())
                .filter(t -> t.value == value)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid status: " + value));
    }
}