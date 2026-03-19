"use client";
const error = ({error, reset} : {
    error: Error,
    reset: () => void
}) => {
  return (
    <div>{error.message}
    <button onClick={reset}>Thử lại</button></div>
  )
};

export default error;
