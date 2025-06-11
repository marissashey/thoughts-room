import React, { useState, useRef } from "react";
import FallingWord from "./components/FallingWord";
import InputBox from "./components/InputBox";
import { useLayoutRefs } from "./hooks/useLayoutRefs";
import { getTextWidth } from "./utils/getTextWidth";

export default function App() {
  const [inputValue, setInputValue] = useState("");
  const [fallingWords, setFallingWords] = useState([]);

  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const layoutRef = useLayoutRefs(inputRef, containerRef);

  function handleEnter() {
    const {
      containerRect,
      inputRect,
      paddingLeft,
      borderLeft,
      font,
      spaceWidth,
    } = layoutRef.current;

    if (!inputValue.trim()) return;

    const leftStart =
      inputRect.left - containerRect.left + paddingLeft + borderLeft;
    const top = inputRect.top - containerRect.top;

    let offset = 0;
    const words = inputValue.trim().split(" ");
    const newWords = words.map((text, i) => {
      const width = getTextWidth(text, layoutRef.current.font);
      const left = leftStart + offset;
      offset += width + spaceWidth;
      return {
        id: crypto.randomUUID(),
        text,
        left,
        top,
        duration: 3 + i * 0.2,
        // color: "#000",
      };
    });

    setFallingWords((prev) => [...prev, ...newWords]);
    setInputValue("");
  }

  function handleSpace() {
    const {
      containerRect,
      inputRect,
      paddingLeft,
      borderLeft,
      font,
      spaceWidth,
    } = layoutRef.current;

    const trimmed = inputValue.trimEnd();
    const words = trimmed.split(" ");
    const lastWord = words[words.length - 1];
    if (!lastWord) return;

    const textBefore = trimmed.slice(0, trimmed.lastIndexOf(lastWord));
    const width = getTextWidth(text, layoutRef.current.font);

    const left =
      inputRect.left -
      containerRect.left +
      paddingLeft +
      borderLeft +
      offsetBefore;
    const top = inputRect.top - containerRect.top;

    const newWord = {
      id: crypto.randomUUID(),
      text: lastWord,
      left,
      top,
      duration: 5,
      color: "#aaa", // faded color
    };

    setFallingWords((prev) => [...prev, newWord]);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleEnter();
    } else if (e.key === " ") {
      handleSpace();
    }
  }

  function onDone(id) {
    setFallingWords((prev) => prev.filter((w) => w.id !== id));
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen flex justify-center items-start pt-40"
    >
      <InputBox
        ref={inputRef}
        value={inputValue}
        onChange={setInputValue}
        onKeyDown={handleKeyDown}
      />

      {fallingWords.map((word) => (
        <FallingWord key={word.id} word={word} onDone={() => onDone(word.id)} />
      ))}

      <style>{`
        @keyframes dropSlow {
          0% {
            transform: translateY(0px);
            opacity: 1;
          }
          100% {
            transform: translateY(300px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
