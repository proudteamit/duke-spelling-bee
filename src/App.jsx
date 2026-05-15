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
    <div className="page-bg min-h-screen flex items-center justify-center p-4 overflow-hidden relative">
      <div className="bubble bubble-1" />
      <div className="bubble bubble-2" />
      <div className="bubble bubble-3" />
      <div className="absolute left-6 top-10 text-6xl animate-bounce">🐝</div>
      <div className="absolute right-10 top-24 text-5xl animate-pulse">🌟</div>
      <div className="absolute bottom-12 left-10 text-6xl animate-bounce">🍭</div>
      <div className="absolute bottom-12 right-10 text-6xl animate-pulse">🦄</div>

      <div className="card-surface w-full max-w-3xl p-8 text-center relative z-10">
        <h1 className="hero-title text-6xl text-fuchsia-600 mb-3">🐝 Spelling Bee</h1>

        <p className="text-xl text-slate-700 mb-6">
          ฝึกคำศัพท์ภาษาอังกฤษแบบสนุก ๆ สำหรับเด็ก ๆ ให้คำตอบแบบชิค ๆ ด้วยเกมนี้
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button onClick={toggleMusic} className="btn-secondary">
            {musicOn ? "🎵 ปิดเพลง" : "🔊 เปิดเพลง"}
          </button>

          <div className="fancy-chip">⭐ Stars: {stars}</div>
          <div className="fancy-chip">🏆 Score: {score}</div>
        </div>

        <div className="hint-card mb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <button onClick={speakWord} className="btn-primary">
              🎧 ฟังคำนี้
            </button>

            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={() => setShowWord((prev) => !prev)} className="btn-accent">
                {showWord ? "ซ่อนคำ" : "ดูคำ"}
              </button>

              <button onClick={() => setShowThai((prev) => !prev)} className="btn-accent">
                {showThai ? "ซ่อนคำแปล" : "ดูคำแปลไทย"}
              </button>
            </div>
          </div>

          {showWord && (
            <div className="mt-4 text-5xl font-black text-purple-700 animate-bounce">
              {currentWord.en}
            </div>
          )}

          {showThai && (
            <div className="mt-4 text-3xl font-black text-fuchsia-700 bg-fuchsia-50 rounded-[28px] py-4 shadow-inner">
              {currentWord.th}
            </div>
          )}
        </div>

        <input
          type="text"
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="พิมพ์คำที่ได้ยินแล้วกด GO!"
          className="answer-input"
        />

        <div className="flex flex-wrap justify-center gap-4">
          <button onClick={checkAnswer} className="btn-primary">
            🚀 GO!
          </button>

          <button onClick={pickRandomWord} className="btn-secondary">
            🎁 คำใหม่
          </button>
        </div>

        {message && (
          <div className="message-bubble">
            {message}
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-black text-slate-700 mb-4">
            🎨 คำศัพท์น่ารัก
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {WORDS.slice(0, 16).map((word) => (
              <div key={word.en} className="word-chip">
                {word.en}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-sm text-slate-500">
          Made with ❤️ for น้องดุ๊ก 🐝✨
        </div>
      </div>
    </div>
  );
}
