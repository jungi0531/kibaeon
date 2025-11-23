package com.kibaeon.backend.user;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String email;
    @Column(nullable = false, length = 60)
    private String password;

    @Column(nullable = false, unique = true, length = 30)
    private String nickname;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CharacterType characterType;

    @Column(nullable = false)
    private Integer totalGames;
    @Column(nullable = false)
    private Integer winCount;
    @Column(nullable = false)
    private Integer maxWpm;
    @Column(nullable = false)
    private Double averageWpm;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
