
import { elements, state, SETTINGS } from "./state.js";
import { jump, startCrouching, stopCrouching } from "./player.js";

// 키보드와 마우스가 함께 사용하는 점프 입력 시작
function startJumpInput() {
    if (state.jumpPressedAt !== 0) return;

    state.jumpPressedAt = Date.now();
    state.highJumpStarted = false;

    // 0.09초 동안 누르면 높은 점프
    state.jumpHoldTimer = setTimeout(() => {
        if (
            state.jumpPressedAt !== 0 &&
            state.gameState === "running"
        ) {
            state.highJumpStarted = true;
            jump(true);
        }
    }, SETTINGS.HIGH_JUMP_DELAY);
}

// 점프 입력 종료
function stopJumpInput() {
    if (state.jumpPressedAt === 0) return;

    clearTimeout(state.jumpHoldTimer);

    // 높은 점프가 시작되지 않았다면 일반 점프
    if (!state.highJumpStarted) {
        jump(false);
    }

    state.jumpPressedAt = 0;
    state.highJumpStarted = false;
}

// 모든 조작 이벤트 등록
export function setupInput() {
    // 키보드 누르기
    document.addEventListener("keydown", event => {
        if (event.code === "Space") {
            event.preventDefault();
            if (event.repeat) return;
            startJumpInput();
        }

        if (event.code === "ArrowDown") {
            event.preventDefault();
            if (event.repeat) return;
            startCrouching();
        }
    });

    // 키보드 떼기
    document.addEventListener("keyup", event => {
        if (event.code === "Space") {
            stopJumpInput();
        }

        if (event.code === "ArrowDown") {
            stopCrouching();
        }
    });

    // 게임 영역에서 드래그 선택 방지
    elements.gameWorld.addEventListener("selectstart", event => {
        event.preventDefault();
    });

    elements.gameWorld.addEventListener("dragstart", event => {
        event.preventDefault();
    });

    // 마우스 왼쪽 버튼 누르기
    elements.gameWorld.addEventListener("mousedown", event => {
        if (event.button !== 0) return;

        event.preventDefault();
        event.stopPropagation();

        startJumpInput();
    });

    // 마우스 버튼 떼기
    document.addEventListener("mouseup", event => {
        if (event.button !== 0) return;
        stopJumpInput();
    });

    // 게임 영역에서 오른쪽 클릭 메뉴 방지
    elements.gameWorld.addEventListener("contextmenu", event => {
        event.preventDefault();
    });

    // 브라우저 창을 벗어나면 누르고 있던 조작 해제
    window.addEventListener("blur", () => {
        clearTimeout(state.jumpHoldTimer);

        state.jumpPressedAt = 0;
        state.highJumpStarted = false;

        stopCrouching();
    });
}
