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
    <div className="min-h-screen bg-gradient-to-b from-cyan-200 via-yellow-100 to-pink-100 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-6 left-6 text-6xl animate-bounce">
        🐝
      </div>

      <div className="absolute top-10 right-10 text-5xl animate-pulse">
        🌈
      </div>

      <div className="absolute bottom-10 left-10 text-5xl animate-bounce">
        ⭐
      </div>

      <div className="absolute bottom-12 right-12 text-6xl animate-pulse">
        🦄
      </div>

      <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl border-[6px] border-yellow-300 p-8 text-center relative z-10">
        <h1 className="text-6xl font-black text-yellow-500 animate-pulse mb-3">
          🐝 Spelling Bee
        </h1>

        <p className="text-xl text-gray-700 mb-6">
          Learn spelling with fun sounds and magic words!
        </p>

        <div className="flex justify-center mb-6">
          <button
            onClick={toggleMusic}
            className="bg-purple-500 hover:scale-105 transition text-white font-black px-6 py-3 rounded-full shadow-xl text-lg"
          >
            {musicOn ? "🎵 Music ON" : "🔇 Music OFF"}
          </button>
        </div>

        <div className="flex justify-center gap-4 flex-wrap mb-6">
          <div className="bg-blue-100 rounded-2xl px-5 py-3 font-black text-lg shadow">
            ⭐ Stars: {stars}
          </div>

          <div className="bg-green-100 rounded-2xl px-5 py-3 font-black text-lg shadow">
            🏆 Score: {score}
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-100 to-orange-100 border-4 border-yellow-200 rounded-3xl p-6 mb-6 shadow-inner">
          <button
            onClick={speakWord}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:scale-105 active:scale-95 transition text-white font-black text-3xl px-10 py-5 rounded-full shadow-2xl"
          >
            🎧 Listen
          </button>

          <div className="mt-5">
            <button
              onClick={() => setShowWord((prev) => !prev)}
              className="text-blue-600 underline font-bold text-lg"
            >
              {showWord ? "Hide Hint" : "Show Hint"}
            </button>
          </div>

          {showWord && (
            <div className="mt-4 text-5xl font-black text-purple-600 animate-bounce">
              {currentWord.en}
            </div>
          )}

          <div className="mt-5 flex justify-center">
            <button
              onClick={() => setShowThai((prev) => !prev)}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:scale-105 transition text-white font-black px-6 py-3 rounded-full shadow-xl text-lg"
            >
              🇹🇭 {showThai ? "Hide Thai" : "Show Thai Meaning"}
            </button>
          </div>

          {showThai && (
            <div className="mt-4 text-3xl font-black text-green-600 bg-green-100 rounded-3xl py-4 animate-pulse shadow-lg">
              {currentWord.th}
            </div>
          )}
        </div>

        <input
          type="text"
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder=""
          className="w-full text-center text-3xl font-black bg-pink-50 border-4 border-pink-200 rounded-3xl p-5 mb-5 focus:outline-none focus:border-pink-500"
        />

        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={checkAnswer}
            className="bg-gradient-to-r from-green-400 to-emerald-500 hover:scale-105 active:scale-95 transition text-white font-black px-10 py-5 rounded-3xl text-2xl shadow-2xl"
          >
            🚀 GO!
          </button>

          <button
            onClick={pickRandomWord}
            className="bg-gradient-to-r from-pink-400 to-fuchsia-500 hover:scale-105 active:scale-95 transition text-white font-black px-10 py-5 rounded-3xl text-2xl shadow-2xl"
          >
            🎁 Surprise Word
          </button>
        </div>

        {message && (
          <div className="mt-6 bg-purple-100 text-purple-700 text-4xl font-black rounded-3xl py-4 animate-bounce shadow-lg">
            {message}
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-black text-gray-700 mb-4">
            🎨 Fun Word Collection
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {WORDS.slice(0, 16).map((word) => (
              <div
                key={word.en}
                className="bg-gradient-to-br from-sky-100 to-cyan-100 rounded-2xl px-3 py-3 text-center font-black text-lg shadow hover:scale-105 transition"
              >
                {word.en}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          Made with ❤️ for น้องดุ๊ก 🐝✨
        </div>
      </div>
    </div>
  );
}
