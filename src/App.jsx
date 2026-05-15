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
    <div className="min-h-screen bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-5 text-7xl animate-bounce opacity-80">🐝</div>
        <div className="absolute top-1/3 right-8 text-6xl animate-pulse opacity-60">✨</div>
        <div className="absolute bottom-1/4 left-10 text-6xl animate-bounce opacity-70" style={{animationDelay: "0.3s"}}>⭐</div>
        <div className="absolute bottom-10 right-5 text-7xl animate-pulse opacity-60" style={{animationDelay: "0.5s"}}>🌈</div>
      </div>

      {/* Main content */}
      <div className="w-full max-w-lg relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-7xl mb-3 drop-shadow-lg">🐝</div>
          <h1 className="text-5xl md:text-6xl font-black text-white drop-shadow-lg mb-2">
            Spelling Bee
          </h1>
          <p className="text-lg md:text-xl text-white text-opacity-90 font-semibold drop-shadow-md">
            Master English Spelling! 🎓
          </p>
        </div>

        {/* Score cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white bg-opacity-95 backdrop-blur-md rounded-2xl p-6 shadow-xl hover:shadow-2xl transition transform hover:scale-105">
            <div className="text-center">
              <div className="text-5xl mb-2">⭐</div>
              <p className="text-4xl font-black text-indigo-600 mb-1">{stars}</p>
              <p className="text-sm font-bold text-gray-600">Stars Earned</p>
            </div>
          </div>

          <div className="bg-white bg-opacity-95 backdrop-blur-md rounded-2xl p-6 shadow-xl hover:shadow-2xl transition transform hover:scale-105">
            <div className="text-center">
              <div className="text-5xl mb-2">🏆</div>
              <p className="text-4xl font-black text-purple-600 mb-1">{score}</p>
              <p className="text-sm font-bold text-gray-600">Score</p>
            </div>
          </div>
        </div>

        {/* Main game card */}
        <div className="bg-white bg-opacity-98 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-6">
          
          {/* Listen button - Primary action */}
          <button
            onClick={speakWord}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-black text-2xl md:text-3xl py-6 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95 mb-6"
          >
            🎧 Listen to the Word
          </button>

          {/* Hint controls */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => setShowWord((prev) => !prev)}
              className={`py-4 px-4 rounded-xl font-bold text-sm md:text-base transition transform ${
                showWord
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              💡 {showWord ? "Hide" : "Show"} Hint
            </button>
            <button
              onClick={() => setShowThai((prev) => !prev)}
              className={`py-4 px-4 rounded-xl font-bold text-sm md:text-base transition transform ${
                showThai
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🇹🇭 {showThai ? "Hide" : "Show"} Thai
            </button>
          </div>

          {/* Hint display - English */}
          {showWord && (
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-2xl p-5 mb-6 text-center animate-pulse">
              <p className="text-gray-600 text-sm font-semibold mb-2">English Word:</p>
              <p className="text-4xl md:text-5xl font-black text-blue-600">{currentWord.en}</p>
            </div>
          )}

          {/* Hint display - Thai */}
          {showThai && (
            <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 rounded-2xl p-5 mb-6 text-center animate-pulse">
              <p className="text-gray-600 text-sm font-semibold mb-2">Thai Meaning:</p>
              <p className="text-4xl md:text-5xl font-black text-green-600">{currentWord.th}</p>
            </div>
          )}

          {/* Input field */}
          <input
            type="text"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer..."
            className="w-full text-center text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-50 to-pink-50 border-3 border-purple-300 rounded-2xl p-5 mb-6 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-300 transition placeholder:text-gray-400"
          />

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={checkAnswer}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-black text-2xl py-5 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
            >
              ✅ Check Answer
            </button>

            <button
              onClick={pickRandomWord}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-black text-xl py-5 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
            >
              🎲 Skip Word
            </button>
          </div>
        </div>

        {/* Message display */}
        {message && (
          <div className="bg-white bg-opacity-98 backdrop-blur-lg rounded-2xl shadow-2xl p-6 mb-6 text-center animate-bounce">
            <p className="text-3xl md:text-4xl font-black text-gray-800">{message}</p>
          </div>
        )}

        {/* Music toggle */}
        <div className="text-center mb-8">
          <button
            onClick={toggleMusic}
            className={`px-8 py-3 rounded-full font-bold text-lg transition transform ${
              musicOn
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-110"
                : "bg-white bg-opacity-80 text-gray-700 shadow-md hover:bg-opacity-100"
            }`}
          >
            {musicOn ? "🎵 Music ON" : "🔇 Music OFF"}
          </button>
        </div>

        {/* Word collection */}
        <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl shadow-xl p-6">
          <h3 className="text-center font-black text-2xl text-gray-800 mb-5">
            📚 Word Collection
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {WORDS.map((word) => (
              <div
                key={word.en}
                className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg p-3 text-center font-bold text-sm text-gray-700 shadow hover:shadow-lg transition transform hover:scale-110"
              >
                {word.en}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white drop-shadow-lg">
          <p className="font-semibold text-lg">Made with ❤️ for น้องดุ๊ก 🐝</p>
          <p className="text-sm text-white text-opacity-75 mt-1">Keep learning, keep improving! ✨</p>
        </div>
      </div>
    </div>
  );
}
