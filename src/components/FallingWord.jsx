import { useEffect, useState } from "react";

export default function FallingWord({ word, onDone }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const timeout = setTimeout(() => {
      onDone();
    }, word.duration * 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={`absolute text-base font-sans`}
      style={{
        top: word.top,
        left: word.left,
        font: word.font,
        color: word.color,
        animation: animate
          ? `dropSlow ${word.duration}s ease-in forwards`
          : "none",
        pointerEvents: "none",
      }}
    >
      {word.text}
    </div>
  );
}
