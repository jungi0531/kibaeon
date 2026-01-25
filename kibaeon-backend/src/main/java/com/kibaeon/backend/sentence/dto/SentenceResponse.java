package com.kibaeon.backend.sentence.dto;

import com.kibaeon.backend.sentence.Sentence;
import lombok.Getter;

@Getter
public class SentenceResponse {
    private Long id;
    private String content;
    private String category;

    public SentenceResponse(Sentence sentence) {
        this.id = sentence.getId();
        this.content = sentence.getContent();
        this.category = sentence.getCategory();
    }
}
