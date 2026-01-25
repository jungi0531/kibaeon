package com.kibaeon.backend.sentence;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SentenceService {
    private final SentenceRepository sentenceRepository;

    // 랜덤 문장 하나 가져오기
    public Sentence getRandomSentence() {
        return sentenceRepository.findRandomSentence().orElseThrow(() -> new RuntimeException("문장이 존재하지 않아요."));
    }
}