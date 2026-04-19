// src/utils/questionGenerator.js
// Generates random math/logic questions grouped by difficulty

const EASY_RANGE = [1, 20];
const MED_RANGE = [2, 12];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeAddition() {
  const a = randInt(...EASY_RANGE);
  const b = randInt(...EASY_RANGE);
  return { question: `${a} + ${b} = ?`, answer: a + b, options: null };
}

function makeSubtraction() {
  const b = randInt(1, 15);
  const a = randInt(b, 20);
  return { question: `${a} - ${b} = ?`, answer: a - b, options: null };
}

function makeMultiplication() {
  const a = randInt(...MED_RANGE);
  const b = randInt(...MED_RANGE);
  return { question: `${a} × ${b} = ?`, answer: a * b, options: null };
}

function makeDivision() {
  const b = randInt(2, 9);
  const answer = randInt(2, 9);
  const a = b * answer;
  return { question: `${a} ÷ ${b} = ?`, answer, options: null };
}

function makeHardExpression() {
  const a = randInt(2, 10);
  const b = randInt(2, 8);
  const c = randInt(1, 5);
  const answer = a * b + c;
  return { question: `${a} × ${b} + ${c} = ?`, answer, options: null };
}

function makeSquare() {
  const a = randInt(2, 12);
  return { question: `${a}² = ?`, answer: a * a, options: null };
}

// Logic questions pool
const logicPool = [
  { question: 'If all cats are animals and Whiskers is a cat, Whiskers is a...?', answer: 'Animal', options: ['Plant', 'Animal', 'Robot', 'Mineral'] },
  { question: 'What comes next: 2, 4, 8, 16, ?', answer: '32', options: ['18', '24', '32', '40'] },
  { question: 'What comes next: 1, 3, 6, 10, ?', answer: '15', options: ['12', '14', '15', '20'] },
  { question: 'If Monday is 2 days after Saturday, what day is 3 days after Thursday?', answer: 'Sunday', options: ['Friday', 'Saturday', 'Sunday', 'Monday'] },
  { question: 'A is taller than B. B is taller than C. Who is shortest?', answer: 'C', options: ['A', 'B', 'C', 'All same'] },
  { question: 'What comes next: 5, 10, 20, 40, ?', answer: '80', options: ['50', '60', '80', '100'] },
  { question: 'An hour has 60 minutes. How many minutes in 2.5 hours?', answer: '150', options: ['120', '130', '150', '180'] },
];

/**
 * Generate an array of questions for a given difficulty.
 * @param {'easy'|'medium'|'hard'} difficulty
 * @param {number} count number of questions (default 4)
 * @returns array of { question, answer, options }
 */
export function generateQuestions(difficulty = 'medium', count = 4) {
  const questions = [];
  for (let i = 0; i < count; i++) {
    let q;
    if (difficulty === 'easy') {
      q = Math.random() < 0.5 ? makeAddition() : makeSubtraction();
    } else if (difficulty === 'medium') {
      const r = Math.random();
      if (r < 0.4) q = makeMultiplication();
      else if (r < 0.7) q = makeDivision();
      else q = logicPool[randInt(0, logicPool.length - 1)];
    } else {
      // hard
      const r = Math.random();
      if (r < 0.45) q = makeHardExpression();
      else if (r < 0.7) q = makeSquare();
      else q = logicPool[randInt(0, logicPool.length - 1)];
    }

    // If options are null (numeric answer), generate 4 multiple-choice options
    if (!q.options) {
      const correct = q.answer;
      const wrongSet = new Set([correct]);
      while (wrongSet.size < 4) {
        const delta = randInt(-10, 10);
        const wrong = correct + delta;
        if (wrong !== correct && wrong >= 0) wrongSet.add(wrong);
      }
      q.options = shuffle([...wrongSet]).map(String);
      q.answer = String(correct);
    }

    questions.push(q);
  }
  return questions;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
