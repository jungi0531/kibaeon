package com.kibaeon.backend.user;

import lombok.Getter;

@Getter
public enum CharacterType {
    KEYCAP_01("키캡 기본", "basic.png");

    private final String name;
    private final String image;

    CharacterType(String name, String image) {
        this.name = name;
        this.image = image;
    }

}
