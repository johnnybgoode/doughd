import { Alert, AlertDescription, AlertTitle } from '@repo/ui/components/alert';
import { CircleAlert } from 'lucide-react';

type ErrorProps = {
  message: string;
  title: string;
};

export const ErrorAlert = ({ message, title }: ErrorProps) => {
  return (
    <Alert className="max-w-md" variant="destructive">
      <CircleAlert />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};
