export type Operation = '+' | '-' | '*' | '/';

export interface MathProblem {
    question: string;
    answer: number;
    options: number[];
}

export interface GameState {
    score: number;
    bonusScore67: number;
    currentProblem: MathProblem | null;
    timeLeft: number;
    isGameOver: boolean;
    showAnimation67: boolean;
}
