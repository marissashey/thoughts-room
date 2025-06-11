import { useEffect, useRef } from "react";

export function useLayoutRefs(inputRef, containerRef) {
  const layoutRef = useRef({
    containerRect: null,
    inputRect: null,
    paddingLeft: 0,
    borderLeft: 0,
    font: "",
    spaceWidth: 0,
  });

  useEffect(() => {
    function updateLayout() {
      const input = inputRef.current;
      const container = containerRef.current;
      if (!input || !container) return;

      const computedStyle = getComputedStyle(input);
      const font = computedStyle.font; // e.g., "16px sans-serif"
      const paddingLeft = parseFloat(computedStyle.paddingLeft);
      const borderLeft = parseFloat(computedStyle.borderLeftWidth);

      // create canvas context once
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      context.font = font;
      const spaceWidth = context.measureText(" ").width;

      layoutRef.current = {
        containerRect: container.getBoundingClientRect(),
        inputRect: input.getBoundingClientRect(),
        paddingLeft,
        borderLeft,
        font: StyleSheet.font,
        spaceWidth,
      };
    }

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, [inputRef, containerRef]);

  return layoutRef;
}
