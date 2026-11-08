import { elements, state } from "./state.js";

// 화면에 점수와 최고 기록 표시
export function updateScore() {
    elements.scoreText.textContent = `점수: ${state.score}`;
    elements.highScoreText.textContent = `최고 기록: ${state.highScore}`;
}

// 점수가 올라갈수록 게임 속도 증가
export function updateGameSpeed() {
    state.gameSpeed = Math.min(
        6 + state.score * 0.005,
        state.maxGameSpeed
    );
}

// 점수 1점 증가 및 최고 기록 저장
export function increaseScore() {
    state.score++;

    updateGameSpeed();

    if (state.score > state.highScore) {
        state.highScore = state.score;
        localStorage.setItem("dinoHighScore", state.highScore);
    }

    updateScore();
}
