package com.kibaeon.backend.sentence;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "sentences")
@Getter
@NoArgsConstructor
public class Sentence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500)
    private String content;

    @Column(length = 50)
    private String category;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public Sentence(String content, String category) {
        this.content = content;
        this.category = category;
    }
}
