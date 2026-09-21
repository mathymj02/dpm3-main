package com.dpm;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class HashGen {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println("HASH_ADMIN123=" + encoder.encode("admin123"));
        System.out.println("HASH_HINCHA123=" + encoder.encode("hincha123"));
    }
}
