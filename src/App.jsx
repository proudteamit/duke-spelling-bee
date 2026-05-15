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
    <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-blue-400 to-purple-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Premium animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-8 left-10 text-9xl animate-bounce opacity-70">🐝</div>
        <div className="absolute top-24 right-16 text-8xl animate-pulse opacity-60">✨</div>
        <div className="absolute bottom-32 left-8 text-8xl opacity-50" style={{animation: "bounce 2s infinite 0.6s"}}>⭐</div>
        <div className="absolute bottom-16 right-12 text-9xl opacity-50" style={{animation: "pulse 2s infinite 0.4s"}}>🌈</div>
        <div className="absolute top-1/2 left-1/3 text-7xl opacity-40 animate-pulse">💫</div>
        <div className="absolute top-1/3 right-1/4 text-7xl opacity-45" style={{animation: "bounce 2s infinite 1.2s"}}>🎈</div>
      </div>

      {/* Main container */}
      <div className="w-full max-w-2xl relative z-10">
        
        {/* Premium Header Card */}
        <div className="bg-white bg-opacity-99 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 md:p-10 mb-8 text-center border-2 border-white border-opacity-60">
          <div className="text-9xl mb-4 drop-shadow-lg animate-bounce">🐝</div>
          <h1 className="text-7xl md:text-8xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-3 drop-shadow-lg">
            Spelling Bee
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-gray-700 mb-8 drop-shadow-md">
            Master English Spelling! 🎓
          </p>

          {/* Premium stats */}
          <div className="grid grid-cols-2 gap-5 md:gap-6">
            <div className="bg-gradient-to-br from-yellow-300 to-orange-400 rounded-2xl p-6 shadow-xl transform hover:scale-110 transition hover:shadow-2xl">
              <p className="text-5xl mb-2">⭐</p>
              <p className="text-4xl md:text-5xl font-black text-white drop-shadow-lg">{stars}</p>
              <p className="text-sm font-bold text-white text-opacity-90 mt-1">Stars Earned</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 shadow-xl transform hover:scale-110 transition hover:shadow-2xl">
              <p className="text-5xl mb-2">🏆</p>
              <p className="text-4xl md:text-5xl font-black text-white drop-shadow-lg">{score}</p>
              <p className="text-sm font-bold text-white text-opacity-90 mt-1">Score Points</p>
            </div>
          </div>
        </div>

        {/* Premium Game Card */}
        <div className="bg-white bg-opacity-99 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 md:p-10 mb-8 border-2 border-white border-opacity-60">
          
          {/* Listen Button - Premium */}
          <button
            onClick={speakWord}
            className="w-full bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 hover:from-yellow-500 hover:via-orange-500 hover:to-yellow-600 text-white font-black text-3xl md:text-4xl py-7 md:py-8 rounded-2xl shadow-2xl transition transform hover:scale-105 active:scale-95 mb-7 drop-shadow-xl"
          >
            🎧 Listen to Word
          </button>

          {/* Hint Controls - Premium */}
          <div className="grid grid-cols-2 gap-4 mb-7">
            <button
              onClick={() => setShowWord((prev) => !prev)}
              className={`py-5 px-4 rounded-xl font-bold text-lg md:text-xl transition transform ${
                showWord
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105 drop-shadow-lg"
                  : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 hover:bg-gradient-to-br hover:from-gray-200 hover:to-gray-300 hover:scale-105"
              }`}
            >
              💡 {showWord ? "Hide" : "Show"} Hint
            </button>
            <button
              onClick={() => setShowThai((prev) => !prev)}
              className={`py-5 px-4 rounded-xl font-bold text-lg md:text-xl transition transform ${
                showThai
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-105 drop-shadow-lg"
                  : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 hover:bg-gradient-to-br hover:from-gray-200 hover:to-gray-300 hover:scale-105"
              }`}
            >
              🇹🇭 {showThai ? "Hide" : "Thai"}
            </button>
          </div>

          {/* English Hint - Premium */}
          {showWord && (
            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 border-4 border-blue-400 rounded-3xl p-7 mb-7 text-center animate-bounce shadow-lg">
              <p className="text-gray-600 text-sm font-black mb-2">📝 English Word</p>
              <p className="text-6xl md:text-7xl font-black text-blue-700 drop-shadow-lg">{currentWord.en}</p>
            </div>
          )}

          {/* Thai Hint - Premium */}
          {showThai && (
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 border-4 border-green-400 rounded-3xl p-7 mb-7 text-center animate-bounce shadow-lg">
              <p className="text-gray-600 text-sm font-black mb-2">🇹🇭 Thai Meaning</p>
              <p className="text-6xl md:text-7xl font-black text-green-700 drop-shadow-lg">{currentWord.th}</p>
            </div>
          )}

          {/* Input Field - Premium */}
          <input
            type="text"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer here..."
            className="w-full text-center text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-50 to-pink-50 border-3 border-purple-300 rounded-2xl p-6 mb-7 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition placeholder:text-gray-400 shadow-lg"
          />

          {/* Action Buttons - Premium */}
          <div className="space-y-4">
            <button
              onClick={checkAnswer}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-black text-3xl md:text-4xl py-6 rounded-2xl shadow-xl transition transform hover:scale-105 active:scale-95 drop-shadow-lg"
            >
              ✅ Check Answer
            </button>

            <button
              onClick={pickRandomWord}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black text-2xl md:text-3xl py-6 rounded-2xl shadow-xl transition transform hover:scale-105 active:scale-95 drop-shadow-lg"
            >
              🎲 Skip & New Word
            </button>
          </div>
        </div>

        {/* Message Display - Premium */}
        {message && (
          <div className="bg-white bg-opacity-99 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 mb-8 text-center border-2 border-white border-opacity-60 animate-bounce">
            <p className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">{message}</p>
          </div>
        )}

        {/* Music Toggle - Premium */}
        <div className="text-center mb-10">
          <button
            onClick={toggleMusic}
            className={`px-10 py-4 rounded-full font-black text-2xl transition transform ${
              musicOn
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl scale-110 drop-shadow-lg"
                : "bg-white bg-opacity-90 text-gray-800 shadow-lg hover:bg-opacity-100 hover:scale-105"
            }`}
          >
            {musicOn ? "🎵 Music ON" : "🔇 Music OFF"}
          </button>
        </div>

        {/* Word Collection - Premium */}
        <div className="bg-white bg-opacity-99 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-white border-opacity-60">
          <h3 className="text-center font-black text-4xl md:text-5xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8 drop-shadow-lg">
            📚 Word Collection
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            {WORDS.map((word, idx) => (
              <div
                key={word.en}
                className="bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 rounded-2xl p-5 text-center font-black text-lg md:text-xl text-gray-800 shadow-lg hover:shadow-2xl transition transform hover:scale-125 hover:-translate-y-2 hover:rotate-1"
                style={{animationDelay: `${idx * 0.05}s`}}
              >
                {word.en}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-10 text-white drop-shadow-xl">
          <p className="font-black text-xl drop-shadow-lg">Made with ❤️ for น้องดุ๊ก 🐝</p>
          <p className="text-base text-white text-opacity-95 mt-2 font-semibold drop-shadow-md">Keep spelling, keep learning! ✨🎓</p>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-25px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
