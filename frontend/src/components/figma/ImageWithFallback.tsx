import React, { useState } from "react";

const ERROR_IMG_SRC =
  "data:image/png;base64,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";

export function ImageWithFallback(
  props: React.ImgHTMLAttributes<HTMLImageElement>
) {
  const [didError, setDidError] = useState(false);

  const handleError = () => {
    setDidError(true);
  };

  const { src, alt, style, className, ...rest } = props;

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${
        className ?? ""
      }`}
      style={style}>
      <div className="flex items-center justify-center w-full h-full">
        <img
          src={ERROR_IMG_SRC}
          alt="Error loading image"
          {...rest}
          data-original-url={src}
        />
      </div>
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      {...rest}
      onError={handleError}
    />
  );
}
