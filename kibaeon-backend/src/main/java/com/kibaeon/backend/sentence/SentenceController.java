package com.kibaeon.backend.sentence;

import com.kibaeon.backend.sentence.dto.SentenceResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sentences")
@RequiredArgsConstructor
public class SentenceController {
    private final SentenceService sentenceService;

    // 랜덤 문장 하나 가져오기
    @GetMapping("/random")
    public ResponseEntity<SentenceResponse> getRandomSentence() {
        Sentence sentence = sentenceService.getRandomSentence();

        return ResponseEntity.ok(new SentenceResponse(sentence));
    }
}
