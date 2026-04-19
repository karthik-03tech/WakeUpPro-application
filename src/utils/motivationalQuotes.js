// src/utils/motivationalQuotes.js
// Collection of motivational quotes to show after alarm dismissal

export const quotes = [
  { quote: "Win the morning, win the day.", author: "Tim Ferriss" },
  { quote: "Discipline beats motivation every single time.", author: "Unknown" },
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { quote: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { quote: "Don't count the days, make the days count.", author: "Muhammad Ali" },
  { quote: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown" },
  { quote: "The early bird catches the worm.", author: "Proverb" },
  { quote: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { quote: "Rise up, start fresh. See the bright opportunity in each day.", author: "Unknown" },
  { quote: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
  { quote: "Don't wish it were easier. Wish you were better.", author: "Jim Rohn" },
  { quote: "The greatest glory in living lies not in never falling, but in rising every time.", author: "Nelson Mandela" },
  { quote: "Champions aren't made in gyms. They are made from something they have deep inside.", author: "Muhammad Ali" },
  { quote: "One day or day one. You decide.", author: "Unknown" },
  { quote: "Arise! Awake! And stop not until the goal is reached.", author: "Swami Vivekananda" },
  { quote: "Make today so awesome, yesterday gets jealous.", author: "Unknown" },
  { quote: "Push yourself because no one else is going to do it for you.", author: "Unknown" },
  { quote: "Hustle in silence. Let success make the noise.", author: "Unknown" },
];

export function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}
