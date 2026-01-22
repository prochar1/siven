import { MathProblem, Operation } from "./types";

const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};

export const generateProblem = (): MathProblem => {
    // Bonus: If it should be 67 (20% chance)
    const is67 = Math.random() < 0.2;

    let question = "";
    let answer = 0;

    if (is67) {
        answer = 67;
        const ops: Operation[] = ['+', '-', '*', '/'];
        const op = ops[getRandomInt(0, 3)];

        switch (op) {
            case '+':
                const a1 = getRandomInt(10, 60);
                question = `${a1} + ${67 - a1}`;
                break;
            case '-':
                const a2 = getRandomInt(68, 100);
                question = `${a2} - ${a2 - 67}`;
                break;
            case '*':
                // Only 1 * 67 or 67 * 1 for simplicity in "malá násobilka" context, 
                // but let's keep it simple.
                question = `1 × 67`;
                break;
            case '/':
                question = `134 ÷ 2`;
                break;
        }
    } else {
        // Generate random problem
        const ops: Operation[] = ['+', '-', '*', '/'];
        const op = ops[getRandomInt(0, 3)];

        switch (op) {
            case '+':
                const a = getRandomInt(1, 50);
                const b = getRandomInt(1, 50);
                answer = a + b;
                question = `${a} + ${b}`;
                break;
            case '-':
                const c = getRandomInt(10, 100);
                const d = getRandomInt(1, c);
                answer = c - d;
                question = `${c} - ${d}`;
                break;
            case '*':
                const e = getRandomInt(2, 10);
                const f = getRandomInt(2, 10);
                answer = e * f;
                question = `${e} × ${f}`;
                break;
            case '/':
                const h = getRandomInt(2, 10);
                const g = getRandomInt(1, 10);
                answer = g;
                question = `${g * h} ÷ ${h}`;
                break;
        }

        // Ensure answer is not 67 by accident if we didn't intend it
        if (answer === 67) return generateProblem();
    }

    // Generate options
    const options = [answer];
    while (options.length < 3) {
        const offset = getRandomInt(-10, 10);
        const wrongAnswer = answer + offset;
        if (wrongAnswer > 0 && !options.includes(wrongAnswer)) {
            options.push(wrongAnswer);
        }
    }

    return {
        question,
        answer,
        options: shuffleArray(options),
    };
};
