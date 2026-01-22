"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateProblem } from "@/utils";
import { MathProblem } from "@/types";
import HandAnimation from "@/components/HandAnimation";
import { Trophy, Zap, Clock } from "lucide-react";

const TIMER_LIMIT = 10;

export default function Game() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [score, setScore] = useState(0);
  const [bonusScore67, setBonusScore67] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_LIMIT);
  const [showAnimation, setShowAnimation] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [highScore, setHighScore] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('math-high-score');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('math-high-score', score.toString());
    }
  }, [score, highScore]);

  const nextProblem = useCallback(() => {
    setProblem(generateProblem());
    setTimeLeft(TIMER_LIMIT);
    setFeedback(null);
  }, []);

  const startGame = () => {
    setScore(0);
    setBonusScore67(0);
    setGameState('playing');
    nextProblem();
  };

  const handleAnswer = (selected: number) => {
    if (!problem || gameState !== 'playing') return;

    if (selected === problem.answer) {
      setFeedback('correct');
      setScore(s => s + 1);

      if (selected === 67) {
        setBonusScore67(b => b + 1);
        setShowAnimation(true);
      }

      // Delay before next problem to show feedback
      setTimeout(nextProblem, 600);
    } else {
      setFeedback('wrong');
      // Briefly show wrong and then maybe move on? 
      // User says "poté se zobrazí další příklad" for the timer, 
      // but let's say wrong answer also moves to next problem or ends game?
      // Usually kids games move to next one.
      setTimeout(nextProblem, 600);
    }
  };

  const handleBonusClick = () => {
    if (bonusScore67 > 0) {
      setBonusScore67(b => b - 1);
      setShowAnimation(true);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing' && !feedback && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => Math.max(0, t - 0.05));
      }, 50);
    }
    return () => clearInterval(interval);
  }, [gameState, feedback]);

  useEffect(() => {
    if (timeLeft <= 0 && gameState === 'playing') {
      nextProblem();
    }
  }, [timeLeft, gameState, nextProblem]);

  if (gameState === 'start') {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass p-8 rounded-3xl text-center max-w-md w-full"
        >
          <h1 className="text-6xl mb-2 text-pink-500 font-black tracking-tighter">SIVEN</h1>
          <div className="mb-6 flex justify-center gap-2 items-center text-yellow-400 font-bold">
            <Trophy size={20} />
            <span>Nejlepší skóre: {highScore}</span>
          </div>
          <p className="text-xl mb-8 text-indigo-200 leading-relaxed px-4">
            Rychlá matematika pro bystré hlavy.<br />
            Dokážeš vyřešit všechny příklady?
          </p>
          <button
            onClick={startGame}
            className="w-full py-4 text-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-transform mb-8 font-bold"
          >
            HRÁT!
          </button>
          <p className="text-sm text-indigo-400/60 leading-relaxed">
            Tato hra používá prohlížeč k uložení vašeho nejlepšího skóre. Žádná data se neodesílají na server.
          </p>
        </motion.div>
        <footer className="mt-8 text-indigo-400/40 text-sm font-medium">
          © 2026 prochar1
        </footer>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-6 w-full max-w-lg mx-auto">
      {/* Header with scores */}
      <div className="w-full flex justify-between items-start mt-4">
        <div className="glass px-4 py-2 rounded-2xl flex items-center gap-2">
          <Trophy className="text-yellow-400" />
          <span className="text-2xl font-bold">{score}</span>
        </div>

        <motion.div
          onClick={handleBonusClick}
          whileTap={{ scale: 0.9 }}
          className="glass px-4 py-2 rounded-2xl flex items-center gap-2 cursor-pointer border-yellow-500/50"
          style={{ border: bonusScore67 > 0 ? '1px solid #EAB308' : '1px solid transparent' }}
        >
          <Zap className={`${bonusScore67 > 0 ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}`} />
          <span className={`text-2xl font-bold ${bonusScore67 > 0 ? "text-yellow-400" : "text-gray-500"}`}>
            {bonusScore67}
          </span>
        </motion.div>
      </div>

      {/* Progress/Timer */}
      <div className="w-full px-4 mt-4">
        <div className="w-full glass h-6 rounded-full overflow-hidden relative shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
            animate={{ width: `${(timeLeft / TIMER_LIMIT) * 100}%` }}
            transition={{ duration: 0.05, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Clock size={14} className="text-white/40 mr-1" />
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Čas běží</span>
          </div>
        </div>
      </div>

      {/* Problem Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full my-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={problem?.question}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            className="text-center"
          >
            <h2 className="text-7xl font-black mb-12 tracking-wider filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              {problem?.question}
            </h2>
          </motion.div>
        </AnimatePresence>

        {/* Answer Buttons */}
        <div className="grid grid-cols-1 gap-4 w-full">
          {problem?.options.map((opt, i) => (
            <motion.button
              key={`${problem.question}-${opt}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer(opt)}
              className={`
                py-6 text-3xl font-bold glass rounded-2xl
                ${feedback === 'correct' && opt === problem.answer ? 'bg-green-500/40 border-green-400' : ''}
                ${feedback === 'wrong' && opt !== problem.answer ? 'opacity-50' : ''}
                ${feedback === 'wrong' && opt === problem.answer ? 'bg-green-500/20' : ''}
              `}
              disabled={!!feedback}
            >
              {opt}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Bonus Animation */}
      <HandAnimation
        isVisible={showAnimation}
        onComplete={() => setShowAnimation(false)}
      />

      {/* Stats/Info at bottom */}
      <div className="w-full flex flex-col items-center py-4 gap-4">
        <div className="text-indigo-400/60 font-medium">
          Vypočítej správný výsledek!
        </div>
        <footer className="text-indigo-400/20 text-xs font-medium">
          © 2026 prochar1
        </footer>
      </div>
    </main>
  );
}
