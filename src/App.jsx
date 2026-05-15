import React, { useEffect, useRef, useState } from "react";

const WORDS = [
  { en: "see", th: "มองเห็น" },
  { en: "toilet", th: "ห้องน้ำ" },
  { en: "foot", th: "เท้า" },
  { en: "bird", th: "นก" },
  { en: "queen", th: "ราชินี" },
  { en: "yellow", th: "สีเหลือง" },
  { en: "frog", th: "กบ" },
  { en: "teacher", th: "คุณครู" },
  { en: "fruit", th: "ผลไม้" },
  { en: "tree", th: "ต้นไม้" },
  { en: "horse", th: "ม้า" },
  { en: "house", th: "บ้าน" },
  { en: "cloud", th: "เมฆ" },
  { en: "shop", th: "ร้านค้า" },
  { en: "monkey", th: "ลิง" },
  { en: "truck", th: "รถบรรทุก" },
  { en: "snake", th: "งู" },
  { en: "toad", th: "คางคก" },
];

export default function SpellingBeeGame() {
  const [currentWord, setCurrentWord] = useState(WORDS[0]);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);
  const [showWord, setShowWord] = useState(false);
  const [showThai, setShowThai] = useState(false);
  const [musicOn, setMusicOn] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    pickRandomWord();
  }, []);

  useEffect(() => {
    const bgMusic = new Audio(
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    );

    bgMusic.loop = true;
    bgMusic.volume = 0.1;

    audioRef.current = bgMusic;

    return () => {
      bgMusic.pause();
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (musicOn) {
      audioRef.current.play().catch(() => {
        console.log("Music autoplay blocked");
      });
    } else {
      audioRef.current.pause();
    }
  }, [musicOn]);

  const pickRandomWord = () => {
    const randomWord =
      WORDS[Math.floor(Math.random() * WORDS.length)];

    setCurrentWord(randomWord);
    setAnswer("");
    setMessage("");
    setShowWord(false);
    setShowThai(false);
  };

  const speakWord = () => {
    if (!("speechSynthesis" in window)) {
      setMessage("⚠️ Browser does not support speech");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(currentWord.en);

    const voices = window.speechSynthesis.getVoices();

    const selectedVoice =
      voices.find((voice) => voice.lang === "en-US") || voices[0];

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.lang = "en-US";
    utterance.rate = 0.7;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
  };

  const CHEERS = [
    "Awesome! Great job!",
    "Amazing work!",
    "Wow! Super smart!",
    "Fantastic spelling!",
    "You are a spelling star!",
    "Excellent job!",
    "Yay! You got it!",
    "Brilliant work!",
  ];

  const playCheer = () => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    const randomCheer =
      CHEERS[Math.floor(Math.random() * CHEERS.length)];

    const cheer = new SpeechSynthesisUtterance(randomCheer);

    cheer.lang = "en-US";
    cheer.rate = 1;
    cheer.pitch = 1.3;

    window.speechSynthesis.speak(cheer);

    return randomCheer;
  };

  const checkAnswer = () => {
    if (!answer.trim()) {
      setMessage("⌨️ Please type the word");
      return;
    }

    const normalizedAnswer = answer.trim().toLowerCase();

    if (normalizedAnswer === currentWord.en.toLowerCase()) {
      const cheerMessage = playCheer();

      setMessage(`🎉 ${cheerMessage}`);

      setScore((prev) => prev + 1);
      setStars((prev) => prev + 1);

      setTimeout(() => {
        pickRandomWord();
      }, 1800);
    } else {
      setMessage(`❌ Oops! It is ${currentWord.en}`);

      if ("speechSynthesis" in window) {
        const wrongVoice = new SpeechSynthesisUtterance(
          `Oops! Try again. The word is ${currentWord.en}`
        );

        wrongVoice.lang = "en-US";
        wrongVoice.rate = 0.8;
        wrongVoice.pitch = 1;

        window.speechSynthesis.speak(wrongVoice);
      }

      setTimeout(() => {
        setMessage("");
      }, 2500);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      checkAnswer();
    }
  };

  const toggleMusic = () => {
    setMusicOn((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-400 flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 text-6xl md:text-8xl animate-bounce">🐝</div>
        <div className="absolute top-1/4 right-5 text-5xl md:text-7xl animate-pulse">✨</div>
        <div className="absolute bottom-20 left-5 text-6xl md:text-8xl animate-bounce" style={{animationDelay: "0.5s"}}>🌟</div>
        <div className="absolute bottom-10 right-10 text-5xl md:text-7xl animate-pulse" style={{animationDelay: "0.3s"}}>🦄</div>
      </div>

      {/* Main container */}
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-black mb-2 drop-shadow-lg">
            🐝 Spelling Bee
          </h1>
          <p className="text-white text-lg md:text-xl font-semibold drop-shadow-md">
            Master Your Spelling Skills!
          </p>
        </div>

        {/* Score section */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white bg-opacity-90 backdrop-blur rounded-2xl p-4 text-center shadow-xl">
            <div className="text-3xl font-black text-yellow-500">⭐</div>
            <div className="text-2xl font-black text-gray-800">{stars}</div>
            <div className="text-sm font-bold text-gray-600">Stars</div>
          </div>
          <div className="bg-white bg-opacity-90 backdrop-blur rounded-2xl p-4 text-center shadow-xl">
            <div className="text-3xl font-black text-blue-500">🏆</div>
            <div className="text-2xl font-black text-gray-800">{score}</div>
            <div className="text-sm font-bold text-gray-600">Score</div>
          </div>
        </div>

        {/* Main game card */}
        <div className="bg-white bg-opacity-95 backdrop-blur rounded-3xl shadow-2xl p-6 md:p-8 mb-6">
          
          {/* Listen button */}
          <button
            onClick={speakWord}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 active:scale-95 transition text-white font-black text-2xl md:text-3xl py-4 md:py-5 rounded-2xl shadow-lg mb-6 transform hover:scale-105"
          >
            🎧 Listen to Word
          </button>

          {/* Hint buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setShowWord((prev) => !prev)}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm md:text-base transition transform ${
                showWord
                  ? "bg-blue-500 text-white shadow-lg scale-105"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              💡 {showWord ? "Hide" : "Show"} Hint
            </button>
            <button
              onClick={() => setShowThai((prev) => !prev)}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm md:text-base transition transform ${
                showThai
                  ? "bg-green-500 text-white shadow-lg scale-105"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              🇹🇭 {showThai ? "Hide" : "Thai"}
            </button>
          </div>

          {/* Show hint */}
          {showWord && (
            <div className="bg-blue-100 border-2 border-blue-300 rounded-2xl p-4 mb-6 text-center animate-bounce">
              <p className="text-gray-600 text-sm font-semibold mb-1">English Word:</p>
              <p className="text-3xl md:text-4xl font-black text-blue-600">{currentWord.en}</p>
            </div>
          )}

          {/* Show Thai */}
          {showThai && (
            <div className="bg-green-100 border-2 border-green-300 rounded-2xl p-4 mb-6 text-center animate-bounce">
              <p className="text-gray-600 text-sm font-semibold mb-1">Thai Meaning:</p>
              <p className="text-3xl md:text-4xl font-black text-green-600">{currentWord.th}</p>
            </div>
          )}

          {/* Input field */}
          <input
            type="text"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type the word here..."
            className="w-full text-center text-2xl md:text-3xl font-black bg-gradient-to-r from-pink-50 to-purple-50 border-3 border-purple-300 rounded-2xl p-4 md:p-5 mb-6 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition"
          />

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={checkAnswer}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 active:scale-95 transition text-white font-black text-xl md:text-2xl py-4 rounded-2xl shadow-xl transform hover:scale-105"
            >
              🚀 Check Answer
            </button>

            <button
              onClick={pickRandomWord}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 active:scale-95 transition text-white font-black text-xl md:text-2xl py-4 rounded-2xl shadow-xl transform hover:scale-105"
            >
              🎁 Skip Word
            </button>
          </div>
        </div>

        {/* Message display */}
        {message && (
          <div className="bg-white bg-opacity-95 backdrop-blur rounded-2xl shadow-xl p-6 text-center mb-6 animate-bounce">
            <p className="text-2xl md:text-3xl font-black text-gray-800">{message}</p>
          </div>
        )}

        {/* Music toggle */}
        <div className="text-center mb-6">
          <button
            onClick={toggleMusic}
            className={`px-6 py-3 rounded-full font-bold text-lg transition transform ${
              musicOn
                ? "bg-purple-600 text-white shadow-lg scale-105"
                : "bg-white text-gray-700 shadow-md hover:bg-gray-100"
            }`}
          >
            {musicOn ? "🎵 Music ON" : "🔇 Music OFF"}
          </button>
        </div>

        {/* Word collection */}
        <div className="bg-white bg-opacity-90 backdrop-blur rounded-2xl shadow-lg p-5">
          <h3 className="text-center font-black text-gray-800 mb-4 text-lg">
            📚 Word Collection
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {WORDS.map((word) => (
              <div
                key={word.en}
                className="bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg p-3 text-center font-bold text-sm md:text-base text-gray-700 shadow hover:shadow-md transition transform hover:scale-105"
              >
                {word.en}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-white drop-shadow-lg">
          <p className="font-semibold">Made with ❤️ for น้องดุ๊ก 🐝✨</p>
        </div>
      </div>
    </div>
  );
}
