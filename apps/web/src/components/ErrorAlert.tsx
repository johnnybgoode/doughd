import { Alert, AlertDescription, AlertTitle } from '@repo/ui/components/alert';
import { Icon } from '@repo/ui/components/icon';

type ErrorProps = {
  message: string;
  title: string;
};

export const ErrorAlert = ({ message, title }: ErrorProps) => {
  return (
    <Alert className="max-w-md" variant="destructive">
      <Icon name="circle-alert" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};
