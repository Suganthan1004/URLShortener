package com.jasmin.urlshortener.util;

import java.util.Random;

public class ShortCodeGenerator {

    private static final String CHAR_SET =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    private static final int LENGTH = 6;

    public static String generateCode() {

        Random random = new Random();
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < LENGTH; i++) {
            int index = random.nextInt(CHAR_SET.length());
            sb.append(CHAR_SET.charAt(index));
        }

        return sb.toString();
    }
}