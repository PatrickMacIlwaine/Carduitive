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
    <div className="text-center text-9xl sm:text-9xl md:text-9xl lg:text-9xl font-bold text-primary">
      {displayedCount > 0 ? displayedCount : "Go!"}
    </div>
  );
}
