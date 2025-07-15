import { useState } from "react";
import { ReactTyped } from "react-typed";
import TextBox from "./TextBox";
import IntroPopup from "./IntroPopup";

const debugMode = false;
export default function Room() {
  const [showIntro, setShowIntro] = useState(!debugMode);

  function handleIntroFinish() {
    setShowIntro(false);
  }

  return showIntro ? (
    <IntroPopup onFinish={handleIntroFinish}></IntroPopup>
  ) : (
    <div className='ml-5 mt-5 '>
      <h1 className='text-xl'>
        <ReactTyped
          strings={["the thoughts room  "]}
          typeSpeed={100}
          showCursor={true}
          // loop
          // backSpeed={150}
        />
      </h1>

      <TextBox />
    </div>
  );
}
