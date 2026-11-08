import { elements, state } from "./state.js";

// 모든 장애물 제거
export function clearObstacles() {
    state.obstacles.forEach(obstacle => obstacle.element.remove());
    state.obstacles = [];
}

// 선인장 생성
export function createCactus() {
    const group = document.createElement("div");
    group.className = "obstacle cactus-group";

    // 가끔 2~3개 묶음, 나머지는 1개
    const count = Math.random() < 0.3
        ? Math.floor(Math.random() * 2) + 2
        : 1;

    let hasLarge = false;

    for (let i = 0; i < count; i++) {
        const cactus = document.createElement("span");
        cactus.className = "cactus";
        cactus.textContent = "🌵";

        const isLarge = Math.random() < 0.5;

        if (isLarge) {
            cactus.classList.add("large");
            hasLarge = true;
        } else {
            cactus.classList.add("small");
        }

        group.appendChild(cactus);
    }

    const position = elements.gameWorld.clientWidth;
    group.style.left = position + "px";
    elements.gameWorld.appendChild(group);

    state.obstacles.push({
        element: group,
        position,
        type: "cactus",
        hasLarge
    });
}

// 익룡 생성
export function createPterodactyl() {
    const pterodactyl = document.createElement("div");
    pterodactyl.className = "obstacle pterodactyl";
    pterodactyl.textContent = "🦅";

    // 낮음, 중간, 높음 중 무작위 선택
    const heights = [
        { name: "low", bottom: 20 },
        { name: "middle", bottom: 55 },
        { name: "high", bottom: 70 }
    ];

    const selectedHeight = heights[
        Math.floor(Math.random() * heights.length)
    ];

    pterodactyl.dataset.height = selectedHeight.name;
    pterodactyl.style.bottom = selectedHeight.bottom + "px";

    const position = elements.gameWorld.clientWidth;
    pterodactyl.style.left = position + "px";
    elements.gameWorld.appendChild(pterodactyl);

    state.obstacles.push({
        element: pterodactyl,
        position,
        type: "pterodactyl",
        height: selectedHeight.name
    });
}

// 다음 장애물 생성까지 기다리는 시간
export function getSpawnDelay() {
    const minDelay = 2200 * 5 / state.gameSpeed;
    const maxDelay = 3200 * 5 / state.gameSpeed;

    return Math.max(
        1200,
        Math.random() * (maxDelay - minDelay) + minDelay
    );
}

// 장애물 하나 생성
export function spawnRandomObstacle() {
    if (Math.random() < 0.12) {
        createPterodactyl();
    } else {
        createCactus();
    }
}

// 다음 장애물 생성 예약
export function scheduleObstacle() {
    if (state.gameState !== "running") return;

    state.spawnTimer = setTimeout(() => {
        if (state.gameState !== "running") return;

        spawnRandomObstacle();
        scheduleObstacle();
    }, getSpawnDelay());
}

// 장애물 이동 및 화면 밖 요소 제거
export function moveObstacles() {
    state.obstacles.forEach(obstacle => {
        obstacle.position -= state.gameSpeed;
        obstacle.element.style.left = obstacle.position + "px";
    });

    state.obstacles = state.obstacles.filter(obstacle => {
        if (obstacle.position < -200) {
            obstacle.element.remove();
            return false;
        }
        return true;
    });
}
