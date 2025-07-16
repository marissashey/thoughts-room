import { useState, useEffect } from "react";
import { ReactTyped } from "react-typed";
import { motion } from "framer-motion";
import TextBox from "./TextBox";

/***
 * META TODO: commit more often
 *
 * TODO: base stuff
 * - (main page) idk how to center stuff nicely - tinkering with the css but it is smushed right now
 * - (both) i want big header and clean spacing across pg
 *
 * TODO: additional features
 * 1: DONE BUTTON
 * add `done` button -> buttonClick -> leave thoughts behind? (y/n) -> y = fade to black; n = display history [but explain it better before so it's understood what the decision is]
 *
 * 2: "A ROOM TO ...""
 * something like npm's funny abbreviations but with reacttyped for writer's block or the soft-lock variant
 * so the text types "the thoughts room", new line, smaller text, "a place to " and then types/untypes hopefully softly encouraging and not cringey and not redundant things like
 * let your thoughts be seen, softly / share what's been sitting with you / name what's been unspoken / write what you haven't said / name the feelings without judgement /
 */

export default function Room() {
  const header = "the doorway";
  const typeSpeed = 100;

  const [typedDone, setTypedDone] = useState(false);
  const [showDoorMsg, setShowDoorMsg] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  // press space -> fade out
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.code === "Space" && !fadeOut) {
        setFadeOut(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [fadeOut]);

  // calculate header typing time -> delay -> show door msg
  useEffect(() => {
    if (typedDone) {
      const delay = (header.length * typeSpeed) / 0.99;
      const timer = setTimeout(() => setShowDoorMsg(true), delay);
      return () => clearTimeout(timer);
    }
  }, [typedDone]);

  if (showIntro) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: fadeOut ? 0 : 1 }}
        transition={{ duration: 1 }}
        onAnimationComplete={() => {
          if (fadeOut) setShowIntro(false); // move to main room
        }}
        className='flex flex-col items-center justify-center min-h-screen px-4 text-center text-base whitespace-pre-wrap'
      >
        {/* the doorway */}
        <ReactTyped
          className=''
          strings={[header]}
          typeSpeed={typeSpeed}
          showCursor={false}
          onComplete={() => setTypedDone(true)}
        />

        {/* a door opens */}

        <div className='min-h-[10rem] flex items-center'>
          {showDoorMsg && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ duration: 3 }}
              onAnimationComplete={() => setShowPrompt(true)}
              className='max-w-md mx-auto text-center leading-relaxed h-20'
            >
              a door opens before you, and somehow you know instantly where it
              leads... a room to give your thoughts a place to land.
            </motion.p>
          )}
        </div>

        <div className='h-10 flex items-center justify-center'>
          {/* press space to enter */}
          {showPrompt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ duration: 1 }}
            >
              press [space] to enter
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  }

  // main content
  // TODO: currently smushed
  return (
    <div className=''>
      <div className=''>
        <ReactTyped
          strings={["the thoughts room"]}
          typeSpeed={100}
          showCursor={false}
        />
      </div>
      <TextBox />
    </div>
  );
}
