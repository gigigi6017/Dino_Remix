import { elements, state, SETTINGS } from "./state.js";
import { playJump, stopCrouching, clearPlayerTimers } from "./player.js";
import {
    clearObstacles,
    spawnRandomObstacle,
    scheduleObstacle,
    moveObstacles
} from "./obstacle.js";
import { checkCollision } from "./collision.js";
import { updateScore, increaseScore } from "./score.js";
import { setupInput } from "./input.js";

// 모든 게임 타이머 정리
function clearGameTimers() {
    clearInterval(state.gameLoop);
    clearInterval(state.scoreTimer);
    clearTimeout(state.spawnTimer);
    clearPlayerTimers();
}

// 게임 실행
function startRunning() {
    if (state.gameState === "running") return;

    state.gameState = "running";
    state.gameSpeed = 6;

    // 시작 직후 2초 동안은 안전하게 진행
    const safeUntil = Date.now() + 2000;

    // 첫 장애물은 2초 후 등장
    state.spawnTimer = setTimeout(() => {
        if (state.gameState !== "running") return;

        spawnRandomObstacle();
        scheduleObstacle();
    }, 2000);

    // 게임 진행 루프
    state.gameLoop = setInterval(() => {
        if (state.gameState !== "running") return;

        moveObstacles();

        if (Date.now() >= safeUntil) {
            checkCollision();
        }
    }, 20);

    // 점수 증가
    state.scoreTimer = setInterval(() => {
        if (state.gameState !== "running") return;
        increaseScore();
    }, 100);
}

// 게임 오버
export function gameOver() {
    if (state.gameState !== "running") return;

    state.gameState = "gameover";

    clearGameTimers();
    stopCrouching();

    state.jumpPressedAt = 0;
    state.highJumpStarted = false;

    elements.gameOverScreen.querySelector("p").textContent =
        `최종 점수: ${state.score}`;

    elements.gameOverScreen.style.display = "flex";
}

// 게임 초기화 후 즉시 재시작
function resetGame() {
    clearGameTimers();
    clearObstacles();

    state.score = 0;
    state.gameSpeed = 6;
    state.isJumping = false;
    state.jumpPressedAt = 0;
    state.highJumpStarted = false;

    stopCrouching();

    elements.dino.style.transition = "none";
    elements.dino.style.bottom = SETTINGS.DINO_BASE_BOTTOM + "px";

    updateScore();

    elements.gameOverScreen.style.display = "none";
    elements.startScreen.style.display = "none";

    startRunning();
}

// 처음 게임 시작
function startGame() {
    if (state.gameState !== "menu") return;

    elements.startScreen.style.display = "none";
    state.gameState = "starting";

    // 처음에는 제자리 점프를 한 뒤 실제 게임 시작
    playJump(SETTINGS.NORMAL_JUMP_HEIGHT, () => {
        startRunning();
    });
}

// 버튼 이벤트 등록
elements.startButton.addEventListener("click", startGame);

elements.restartButton.addEventListener("click", event => {
    event.stopPropagation();
    resetGame();
});

// 조작 이벤트 등록
setupInput();

// 처음 점수 표시
updateScore();
