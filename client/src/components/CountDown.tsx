import React, { useEffect, useState } from "react";

interface CountDownProps {
  countdown: number;
}

export default function CountDown({ countdown }: CountDownProps) {
  const [displayedCount, setDisplayedCount] = useState(countdown);

  useEffect(() => {
    setDisplayedCount(countdown);
  }, [countdown]);

  return (
    <div className="text-center text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-primary">
      {displayedCount > 0 ? displayedCount : "Go!"}
    </div>
  );
}
