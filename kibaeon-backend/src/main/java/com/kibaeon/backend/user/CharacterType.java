package com.kibaeon.backend.user;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum CharacterType {
    KEYCAP_01("ㅁ 키캡", "KEYCAP_01.png"),
    KEYCAP_02("ㄴ 키캡", "KEYCAP_02.png"),
    KEYCAP_03("ㅇ 키캡", "KEYCAP_03.png");

    private final String name;
    private final String image;
}
