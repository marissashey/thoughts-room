import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Measure from "react-measure";

export default function TextBox() {
  const [input, setInput] = useState("");
  const [fallingWords, setFallingWords] = useState([]);
  const [lastWord, setLastWord] = useState(null);
  const [scrollLeft, setScrollLeft] = useState(0);

  const inputRef = useRef(null);
  const mirrorRef = useRef(null);

  useEffect(() => {
    if (mirrorRef.current) mirrorRef.current.scrollLeft = scrollLeft;
  }, [scrollLeft]);

  function handleResize(rect) {
    const inputBox = inputRef.current?.getBoundingClientRect();
    if (!inputBox || !lastWord) return;

    const x = rect.bounds.left - inputBox.left - scrollLeft;
    const y = rect.bounds.top - inputBox.top;

    const newWord = {
      id: crypto.randomUUID(),
      word: lastWord,
      x,
      y,
    };

    setFallingWords((prev) => [...prev, newWord]);
    setLastWord(null);
  }

  function handleAnimationComplete(id) {
    setFallingWords((prev) => prev.filter((w) => w.id !== id));
  }

  return (
    <div className='relative w-full max-w--center'>
      {/* input */}
      <input
        className='w-full border-b outline-none bg-transparent absolute whitespace-nowrap overflow-x-auto'
        ref={inputRef}
        value={input}
        onChange={(e) => {
          const val = e.target.value;

          const cur = val[val.length - 1];

          if (cur === " ") {
            const words = val.trim().split(" ");

            const last = words[words.length - 1];
            setLastWord(last);
          }
          if (val.length != 1 || cur !== " ") {
            setInput(val);
          }
        }}
        onScroll={(e) => {
          setScrollLeft(e.target.scrollLeft);
        }}
        placeholder='type here...'
      />

      {/* INVISIBLE MIRROR SPANS */}
      <div className='absolute w-full whitespace-nowrap invisible'>
        {input
          .trim()
          .split(" ")
          .map((word, i, arr) => {
            const endsWithSpace = input.endsWith(" ");
            const isLastTyped = i === arr.length - 1 && endsWithSpace;

            return isLastTyped ? (
              <Measure key={i} bounds onResize={handleResize}>
                {({ measureRef }) => (
                  <span ref={measureRef}>{word + "\u00A0"}</span>
                )}
              </Measure>
            ) : (
              <span key={i}>{word + "\u00A0"}</span>
            );
          })}
      </div>

      {/* ANIMATED FALLING WORDS */}
      {fallingWords.map((fw) => (
        <motion.span
          key={fw.id}
          className='absolute text-gray-300 pointer-events-none z-20 whitespace-nowrap overflow-hidden'
          initial={{ x: fw.x, y: fw.y, opacity: 1 }}
          animate={{ y: fw.y + 300, opacity: 0 }}
          transition={{ duration: 10 }}
          onAnimationComplete={() => handleAnimationComplete(fw.id)}
        >
          {fw.word}
        </motion.span>
      ))}
    </div>
  );
}
