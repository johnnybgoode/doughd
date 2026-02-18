import type { StepsType } from '@repo/database/schemas';
import { Progress } from '@repo/ui/components/progress';
import { Heading } from '@repo/ui/components/typography';
import { useCallback, useState } from 'react';
import { TimerButton } from './Timer';

interface StepsProps {
  steps: StepsType;
}

export function RecipeSteps({ steps }: StepsProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const advanceStep = useCallback(
    () => setCurrentStepIdx(currentStepIdx + 1),
    [currentStepIdx],
  );

  if (steps.length === 0 || steps[currentStepIdx] === undefined) {
    throw new Error('Step index out of bounds');
  }

  const currentStep = steps[currentStepIdx];
  const descriptionLines = currentStep.description.split('\n');
  const progress = (currentStepIdx / Math.min(steps.length - 1, 1)) * 100;

  return (
    <div className="flex flex-col items-center py-8">
      <Heading className="pb-4 text-gray-800" level="3">
        {currentStep.title}
      </Heading>
      <div className="pb-4">
        <ol>
          {descriptionLines.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ol>
      </div>
      <div className="my-4">
        {currentStep.time && (
          <TimerButton onDone={advanceStep} time={currentStep.time} />
        )}
      </div>
      <div className="my-6 w-[80%]">
        <Progress className="" value={progress} />
      </div>
    </div>
  );
}
