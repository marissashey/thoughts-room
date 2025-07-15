import { useState, useEffect, useRef } from "react";
import { ReactTyped } from "react-typed";
import "./index.css";

const introMessages = [
  "you've found the thoughts room.",
  "what's on your mind?",
];

export default function IntroPopup({ onFinish }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const messageRef = useRef(null);

  // Show prompt once message fade-in completes
  useEffect(() => {
    setShowPrompt(false);
    const msgElem = messageRef.current;

    function handleAnimationEnd(e) {
      if (e.animationName === "fade-in") {
        setShowPrompt(true);
      }
    }

    msgElem?.addEventListener("animationend", handleAnimationEnd);

    return () =>
      msgElem?.removeEventListener("animationend", handleAnimationEnd);
  }, [msgIndex]);

  // Space key handling
  useEffect(() => {
    function handleKey(e) {
      if (e.code === "Space" && isVisible && !isFadingOut && showPrompt) {
        e.preventDefault();
        setIsFadingOut(true);

        setTimeout(() => {
          setIsFadingOut(false);
          if (msgIndex < introMessages.length - 1) {
            setMsgIndex((i) => i + 1);
          } else {
            setIsVisible(false);
            onFinish();
          }
        }, 500);
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [msgIndex, isVisible, isFadingOut, showPrompt, onFinish]);

  if (!isVisible) return null;

  return (
    <div className='fixed inset-0 flex flex-col justify-center items-center bg-opacity-80 z-50 p-4'>
      <ReactTyped
        ref={messageRef}
        key={msgIndex}
        className={`text-4xl text-white text-center mb-6 ${
          isFadingOut ? "fade-out" : "fade-in"
        }`}
        style={{ animationDuration: "0.5s" }}
        strings={[introMessages[msgIndex]]}
        typeSpeed={80}
      />

      {showPrompt && (
        <div
          className={`text-white text-center ${
            isFadingOut ? "fade-out" : "fade-in"
          }`}
          style={{ animationDuration: "0.5s" }}
        >
          [press space to continue]
        </div>
      )}
    </div>
  );
}

/**
 * 
 * <ReactTyped
           strings={["the thoughts room  "]}
           typeSpeed={100}
           showCursor={true}
           // loop
           // backSpeed={150}
         />
 */
