import { Button } from '@repo/ui/components/button';
import { useCallback, useEffect, useRef, useState } from 'react';

const formatTime = (timeMs: number) => {
  const timeSeconds = Math.floor(timeMs / 1000);
  const hours = Math.floor(timeSeconds / 3600);
  const minutes = Math.floor((timeSeconds - hours * 3600) / 60);
  const seconds = timeSeconds - minutes * 60;
  const hourStr = `${hours}`.padStart(2, '0');
  const minuteStr = `${minutes}`.padStart(2, '0');
  const secondStr = `${seconds}`.padStart(2, '0');

  return `${hourStr}:${minuteStr}:${secondStr}`;
};

interface TimerProps {
  time: number;
  onDone: () => void;
  onTick: (nextTime: string) => void;
}

const useTimer = ({ time, onDone, onTick }: TimerProps) => {
  const intervalId = useRef<number | undefined>(undefined);
  const [completionTime, setCompletionTime] = useState<number | null>(null);

  const handleStart = useCallback(() => {
    if (intervalId.current) {
      return;
    }
    setCompletionTime(Date.now() + time * 1000);
  }, [time]);

  const handleStop = useCallback(() => {
    clearInterval(intervalId.current);
    intervalId.current = undefined;
    setCompletionTime(null);
    onDone();
  }, [onDone]);

  useEffect(() => {
    const isRunning = completionTime !== null && completionTime > Date.now();
    if (isRunning && !intervalId.current) {
      onTick(formatTime(completionTime - Date.now()));

      intervalId.current = window.setInterval(() => {
        const timeDelta = completionTime - Date.now();
        if (timeDelta > 0) {
          onTick(formatTime(timeDelta));
        } else {
          handleStop();
        }
      }, 1000);
    }
    return () => clearInterval(intervalId.current);
  }, [completionTime, handleStop, onTick]);

  return {
    handleStart,
    handleStop,
    isRunning:
      completionTime !== null &&
      completionTime > Date.now() &&
      intervalId.current !== undefined,
  } as const;
};

export const TimerButton = ({ time, onDone }: Omit<TimerProps, 'onTick'>) => {
  const [buttonText, setButtonText] = useState('Start');

  const handleDone = useCallback(() => {
    setButtonText('Start');
    onDone();
  }, [onDone]);

  const { handleStart, isRunning } = useTimer({
    time,
    onDone: handleDone,
    onTick: setButtonText,
  });

  return (
    <Button
      className="cursor-pointer px-4"
      disabled={isRunning}
      onClick={handleStart}
      size="lg"
    >
      {buttonText}
    </Button>
  );
};

// TODO support ad-hoc timer override
// export const Timer = ({ time, onDone }: Omit<TimerProps, 'onTick'>) => {
//   const timeFormatted = formatTime(time * 1000);
//   const [timeLeft, setTimeLeft] = useState(timeFormatted);
//   const handleDone = useCallback(() => {
//     setTimeLeft(timeFormatted);
//     onDone();
//   }, [timeFormatted, onDone]);

//   const { handleStart, isRunning } = useTimer({
//     time,
//     onDone: handleDone,
//     onTick: setTimeLeft,
//   });

//   const onChangeTime = useCallback((e: ChangeEvent<HTMLInputElement>) => {
//     setTimeLeft(e.currentTarget.value);
//   }, []);

//   const timerId = useId();

//   return (
//     <FieldSet>
//       <FieldGroup>
//         <FieldLabel htmlFor={timerId}>Time: </FieldLabel>
//         <Input
//           id={timerId}
//           onChange={onChangeTime}
//           readOnly={isRunning}
//           value={timeLeft}
//         />
//       </FieldGroup>
//       <Button onClick={handleStart}>Start</Button>
//     </FieldSet>
//   );
// };
