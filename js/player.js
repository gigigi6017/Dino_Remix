import { elements, state, SETTINGS } from "./state.js";
import { gameOver } from "./game.js";

// 숙이기 해제
export function stopCrouching() {
    state.isCrouching = false;
    elements.dino.classList.remove("crouching");
}

// 점프 동작 자체를 실행
export function playJump(height = SETTINGS.NORMAL_JUMP_HEIGHT, callback = () => {}) {
    if (state.isJumping) return;

    state.isJumping = true;
    stopCrouching();

    const jumpDuration = height === SETTINGS.HIGH_JUMP_HEIGHT ? 0.45 : 0.35;

    elements.dino.style.transition = "none";
    elements.dino.style.bottom = SETTINGS.DINO_BASE_BOTTOM + "px";

    requestAnimationFrame(() => {
        // 상승
        elements.dino.style.transition = `bottom ${jumpDuration}s ease-out`;
        elements.dino.style.bottom = height + SETTINGS.DINO_BASE_BOTTOM + "px";

        const upTimer = setTimeout(() => {
            if (!state.isJumping) return;

            // 하강
            elements.dino.style.transition = `bottom ${jumpDuration}s ease-in`;
            elements.dino.style.bottom = SETTINGS.DINO_BASE_BOTTOM + "px";

            const downTimer = setTimeout(() => {
                state.isJumping = false;
                callback();
            }, jumpDuration * 1000);

            state.jumpTimers.push(downTimer);
        }, jumpDuration * 1000);

        state.jumpTimers.push(upTimer);
    });
}

// 큰 선인장이 가까이 있으면 높은 점프 선택
function getJumpHeight() {
    const dinoPosition = elements.dino.offsetLeft;

    const nearbyCactus = state.obstacles.find(obstacle => {
        return (
            obstacle.type === "cactus" &&
            obstacle.position > dinoPosition &&
            obstacle.position < dinoPosition + 300 &&
            obstacle.hasLarge
        );
    });

    return nearbyCactus
        ? SETTINGS.HIGH_JUMP_HEIGHT
        : SETTINGS.NORMAL_JUMP_HEIGHT;
}

// 게임 중 점프 입력
export function jump(isHighJump = false) {
    if (state.gameState !== "running" || state.isJumping) return;

    const height = isHighJump
        ? SETTINGS.HIGH_JUMP_HEIGHT
        : getJumpHeight();

    // 착지 후에도 점프 입력을 누르고 있으면 높은 점프 반복
    playJump(height, () => {
        if (
            state.highJumpStarted &&
            state.jumpPressedAt !== 0 &&
            state.gameState === "running"
        ) {
            jump(true);
        }
    });
}

// 숙이기
export function startCrouching() {
    if (state.gameState !== "running") return;
    if (state.isJumping || state.isCrouching) return;

    state.isCrouching = true;
    elements.dino.classList.add("crouching");
}

// 점프 관련 타이머 정리
export function clearPlayerTimers() {
    state.jumpTimers.forEach(timer => clearTimeout(timer));
    state.jumpTimers = [];
    clearTimeout(state.jumpHoldTimer);
}
