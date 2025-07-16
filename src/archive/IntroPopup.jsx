import { useState, useEffect } from "react";
import { ReactTyped } from "react-typed";
import { motion, AnimatePresence } from "framer-motion";
import "./index.css";

const message = `a door opens before you, and somehow you know instantly where it leads: the thoughts room, a place where you can ease thoughts off your shoulders, see them fall away, and leave them behind.`;

export default function IntroPopup({ onFinish }) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.code === "Space" && showPrompt) {
        e.preventDefault();
        setIsVisible(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showPrompt]);

  return (
    <div className='flex flex-col items-center justify-center max-w-3xl mx-auto px-4 sm:px-6 lg:px-24'>
      <ReactTyped
        className='whitespace-pre-wrap'
        strings={["the hallway"]}
        typeSpeed={150}
        showCursor={false}
      />

      <div className=''>
        {isVisible && (
          <motion.div
            className=''
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 10 }}
            onComplete={() => setShowPrompt(true)}
          >
            <div>
              <ReactTyped
                className='whitespace-pre-wrap'
                strings={[message]}
                typeSpeed={0}
                showCursor={false}
              />
            </div>

            {showPrompt && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 0 }}
                className='text-right'
              >
                [press space to continue]
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
