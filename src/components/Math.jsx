import React from "react";
// import "katex/dist/katex.min.css";
import TeX from "@matejmazur/react-katex";

// Reused CodeBlock styles for the MathBlock, it should look the same
const MathBlock = ({ title, children, math, block }) => {
  return (
    <TeX>y = x</TeX>
  )
  if (block) {
  return (
    <React.Fragment>
      {title && <div sx={{ variant: `styles.CodeBlock.title` }}>{title}</div>}
      <TeX
        block
        sx={{
          variant: `styles.CodeBlock`,
          borderTopLeftRadius: title ? `0` : undefined,
          borderTopRightRadius: title ? `0` : undefined,
          ".newline": {
            height: 3,
          },
        }}
        math={math}
        settings={{ strict: false }}
      >
        {/*
            either use the math prop or the children prop. So children can be undefined.
            If children is passed, it should be a JavaScript string with valid LaTeX syntax (require some escaping of \ characters)
          */}
        {children ? children : null}
      </TeX>
    </React.Fragment>
  );
  } else {
    return (
      <React.Fragment>
          <TeX>{ children }</TeX>,
      </React.Fragment>
    )
  }
};

export default MathBlock;