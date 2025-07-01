"use client";
import { useState, useRef, useEffect } from "react";

export default function FallingTextInputBox() {
  const [input, setInput] = useState("");
  const [fallingWords, setFallingWords] = useState([]);
  const [twinkleIndex, setTwinkleIndex] = useState(null);
  const [lastTwinkleTime, setLastTwinkleTime] = useState(0);
  const containerRef = useRef(null);
  const wordRefs = useRef([]);
  const starsRef = useRef([]);

  useEffect(() => {
    starsRef.current = Array.from({ length: 50 }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      baseOpacity: Math.random() * 0.3 + 0.2,
    }));
  }, []);

  function triggerTwinkle() {
    const now = Date.now();
    if (now - lastTwinkleTime < 500) return; // throttle
    setLastTwinkleTime(now);
    const i = Math.floor(Math.random() * starsRef.current.length);
    setTwinkleIndex(i);
    setTimeout(() => setTwinkleIndex(null), 1200);
  }

  function handleTyping() {
    triggerTwinkle();
  }

  function handleInputChange(e) {
    // handleTyping();
    const newInput = e.target.value;
    const words = newInput.trim().split(/\s+/);
    const endsWithSpace = newInput.endsWith(" ");
    setInput(newInput);

    if (endsWithSpace && words.length > 0 && newInput.length > input.length) {
      // prevent re-animate when backspacing into " "
      const index = words.length - 1;
      dropWord(words[index], index, `${words[index]}_${index}`);
    }
  }

  function handleKeyDown(e) {
    handleTyping();
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = input.trim();
      if (!trimmed) return setInput("");
      if (!input.endsWith(" ")) {
        const words = trimmed.split(/\s+/);
        dropWord(
          words.at(-1),
          words.length - 1,
          `${words.at(-1)}_${words.length - 1}`
        );
      }
      setInput("");
    }
  }

  function dropWord(word, index, key) {
    const span = wordRefs.current[index];
    const containerBox = containerRef.current?.getBoundingClientRect();
    const spanBox = span?.getBoundingClientRect();
    if (!span || !containerBox || !spanBox) return;

    const newWord = {
      id: `${key}_${Date.now()}`,
      text: word,
      top: spanBox.top - containerBox.top,
      left: spanBox.left - containerBox.left,
    };
    setFallingWords((prev) => [...prev, newWord]);
  }

  function removeWord(id) {
    setFallingWords((prev) => prev.filter((w) => w.id !== id));
  }

  function renderMirrorSpans() {
    const parts = input.split(/(\s+)/); // split the input string on whitespace, but keep the whitespace included in the list for precise rendering positions of subsequent words
    wordRefs.current = [];
    let wordIndex = 0;
    return parts.map((chunk, i) =>
      /\s+/.test(chunk) ? (
        chunk // do not create span element for whitespace
      ) : (
        <span
          key={i} // for helping React identify list elements
          ref={(el) => (wordRefs.current[wordIndex++] = el)} // tells react: after you create this `span` element in the DOM, call this function to give me the DOM node and i'll store it in `wordRefs.current`
          className="mirror-word"
        >
          {chunk}
        </span>
      )
    );
  }

  return (
    <>
      {/* Starfield */}
      {/* <Starfield starsRef={starsRef} twinkleIndex={twinkleIndex} /> */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {starsRef.current.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full transition-all duration-700 ease-in-out"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${twinkleIndex === i ? star.size * 3 : star.size}px`,
              height: `${twinkleIndex === i ? star.size * 3 : star.size}px`,
              backgroundColor: twinkleIndex === i ? "yellow" : "white",
              opacity: twinkleIndex === i ? 1 : star.baseOpacity,
              boxShadow:
                twinkleIndex === i
                  ? "0 0 12px 6px rgba(255, 255, 100, 0.8)"
                  : "none",
            }}
          />
        ))}
      </div>

      <header className="flex text-white font-semibold select-none mb-4">
        thoughts room
      </header>
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div ref={containerRef} className="container max-w-xl w-full">
          <input
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder=""
            spellCheck={false}
            className="text-xl w-full p-2 bg-transparent border-b border-white focus:border-blue-400 outline-none"
            autoComplete="off"
          />
          <div className="mirror-text">{renderMirrorSpans()}</div>
          {fallingWords.map((word) => (
            <FallingWord
              key={word.id}
              word={word}
              onDone={() => removeWord(word.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function FallingWord({ word, onDone }) {
  const [start, setStart] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setStart(true));
    const timer = setTimeout(onDone, 3000);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, []);
  return (
    <div
      className="falling-word"
      style={{
        top: word.top,
        left: word.left,
        zIndex: 50,
        transition: "transform 5s ease, opacity 5s ease",
        transform: start ? "translateY(200px) rotate(180deg)" : "translateY(0)",
        opacity: start ? 0 : 1,
      }}
    >
      {word.text}
    </div>
  );
}

// function Starfield() {
//   return (
//     <>
//       <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
//         {starsRef.current.map((star, i) => (
//           <div
//             key={i}
//             className="absolute rounded-full transition-all duration-700 ease-in-out"
//             style={{
//               top: `${star.top}%`,
//               left: `${star.left}%`,
//               width: `${twinkleIndex === i ? star.size * 3 : star.size}px`,
//               height: `${twinkleIndex === i ? star.size * 3 : star.size}px`,
//               backgroundColor: twinkleIndex === i ? "yellow" : "white",
//               opacity: twinkleIndex === i ? 1 : star.baseOpacity,
//               boxShadow:
//                 twinkleIndex === i
//                   ? "0 0 12px 6px rgba(255, 255, 100, 0.8)"
//                   : "none",
//             }}
//           />
//         ))}
//       </div>
//     </>
//   );
// }
