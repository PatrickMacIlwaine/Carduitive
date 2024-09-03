import React, { useEffect, useState } from 'react';

interface CountDownProps {
  countdown: number;
}

export default function CountDown({ countdown }: CountDownProps) {
  const [displayedCount, setDisplayedCount] = useState(countdown);

  useEffect(() => {
    setDisplayedCount(countdown);
  }, [countdown]);

  return (
    <div style={{ textAlign: 'center', fontSize: '48px', fontWeight: 'bold' }}>
      {displayedCount > 0 ? displayedCount : 'Go!'}
    </div>
  );
}
