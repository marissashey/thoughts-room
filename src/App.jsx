import {useState, useRef} from "react";

export default function FallingTextInputBox() {
  const [input, setInput] = useState("");
  const [fallingWords, setFallingWords] = useState([]);
  const containerRef = useRef(null);
  const wordRefs = useRef([]);

  const handleInputChange = (e) => {
    const newInput = e.target.value;
    setInput(newInput);

    if (newInput.endsWith(" ")) {
      const words = newInput.trim().split(/\s+/);
      const index = words.length - 1;
      dropWord(words[index], index);
    }
  };

  const dropWord = (word, index) => {
    const span = wordRefs.current[index];
    const containerBox = containerRef.current?.getBoundingClientRect();
    const spanBox = span?.getBoundingClientRect();
    if (!span || !containerBox || !spanBox) return;

    setFallingWords((prev) => [
      ...prev,
      {
        id: `${word}_${Date.now()}`,
        text: word,
        top: spanBox.top - containerBox.top,
        left: spanBox.left - containerBox.left,
      },
    ]);
  };

  const removeWord = (id) => {
    setFallingWords((prev) => prev.filter((w) => w.id !== id));
  };

  const renderMirrorSpans = () => {
    return input.split(/(\s+)/).map((chunk, i) =>
      /\s+/.test(chunk) ? (
        chunk
      ) : (
        <span
          key={i}
          ref={(el) => (wordRefs.current[i] = el)}
          className='mirror-word'
        >
          {chunk}
        </span>
      )
    );
  };

  return (
    <>
      <header className='flex text-white font-semibold select-none mb-4'>
        thoughts room
      </header>
      <div className='min-h-screen flex items-center justify-center px-4 py-8'>
        <div ref={containerRef} className='container max-w-xl w-full'>
          <input
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
            placeholder=''
            spellCheck={false}
            className='text-xl w-full p-2 bg-transparent border-b border-white focus:border-blue-400 outline-none'
            autoComplete='off'
          />
          <div className='mirror-text'>{renderMirrorSpans()}</div>
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

function FallingWord({word, onDone}) {
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
      className='falling-word'
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
