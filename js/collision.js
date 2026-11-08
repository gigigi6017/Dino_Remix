import { elements, state } from "./state.js";
import { gameOver } from "./game.js";

// 공룡과 장애물이 겹쳤는지 확인
export function checkCollision() {
    const dinoRect = elements.dino.getBoundingClientRect();

    // 공룡의 충돌 범위는 실제 크기보다 조금 작게 설정
    const dinoLeft = dinoRect.left + 10;
    const dinoRight = dinoRect.right - 10;
    const dinoTop = dinoRect.top + 6;
    const dinoBottom = dinoRect.bottom - 5;

    for (const obstacle of state.obstacles) {
        // 선인장 충돌 검사
        if (obstacle.type === "cactus") {
            const cacti = obstacle.element.querySelectorAll(".cactus");

            for (const cactus of cacti) {
                const rect = cactus.getBoundingClientRect();

                const hit =
                    dinoLeft < rect.right &&
                    dinoRight > rect.left &&
                    dinoTop < rect.bottom &&
                    dinoBottom > rect.top;

                if (hit) {
                    gameOver();
                    return;
                }
            }
        }

        // 익룡은 몸통 중심 부분만 충돌 검사
        if (obstacle.type === "pterodactyl") {
            const rect = obstacle.element.getBoundingClientRect();

            const left = rect.left + rect.width * 0.2;
            const right = rect.right - rect.width * 0.2;
            const top = rect.top + rect.height * 0.2;
            const bottom = rect.bottom - rect.height * 0.2;

            const hit =
                dinoLeft < right &&
                dinoRight > left &&
                dinoTop < bottom &&
                dinoBottom > top;

            if (hit) {
                gameOver();
                return;
            }
        }
    }
}
