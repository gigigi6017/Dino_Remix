// 게임에서 여러 파일이 함께 사용하는 상태와 HTML 요소들

export const elements = {
    dino: document.querySelector(".dino"),
    gameWorld: document.querySelector(".game-world"),
    startScreen: document.querySelector(".start-screen"),
    startButton: document.querySelector("#start-button"),
    gameOverScreen: document.querySelector(".game-over-screen"),
    restartButton: document.querySelector("#restart-button"),
    scoreText: document.querySelector(".game-info span:first-child"),
    highScoreText: document.querySelector(".game-info span:last-child")
};

export const state = {
    gameState: "menu",
    isJumping: false,
    isCrouching: false,

    score: 0,
    highScore: Number(localStorage.getItem("dinoHighScore")) || 0,

    gameSpeed: 6,
    maxGameSpeed: 9,

    obstacles: [],
    spawnTimer: null,
    gameLoop: null,
    scoreTimer: null,

    // 점프 입력 상태: 키보드와 마우스가 함께 사용
    jumpPressedAt: 0,
    jumpHoldTimer: null,
    highJumpStarted: false,

    jumpTimers: []
};

export const SETTINGS = {
    DINO_BASE_BOTTOM: 20,
    NORMAL_JUMP_HEIGHT: 100,
    HIGH_JUMP_HEIGHT: 135,
    HIGH_JUMP_DELAY: 90
};
