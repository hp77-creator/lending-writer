import { useState, useEffect, useRef } from 'react';

export function useReviewTimer(appId: string) {
  const [startTime, setStartTime] = useState<number>(Date.now());
  const timerRef = useRef<number>(Date.now());

  // Reset timer whenever the appId changes
  useEffect(() => {
    const now = Date.now();
    setStartTime(now);
    timerRef.current = now;
  }, [appId]);

  const getTimeSpentSeconds = () => {
    return Math.floor((Date.now() - timerRef.current) / 1000);
  };

  return { getTimeSpentSeconds };
}
