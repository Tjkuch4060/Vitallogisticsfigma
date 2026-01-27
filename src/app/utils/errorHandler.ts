import { toast } from 'sonner';

export function handleError(error: unknown, context?: string) {
  console.error(`Error in ${context}:`, error);

  if (error instanceof Error) {
    toast.error('An error occurred', {
      description: error.message,
      duration: 5000
    });
  } else {
    toast.error('An unexpected error occurred', {
      description: 'Please try again or contact support',
      duration: 5000
    });
  }
}
