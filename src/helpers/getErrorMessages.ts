interface ErrorMessage {
  error: string;
  status: number;
}

type ErrorType = 'year' | 'month' | 'day';

const ERROR_MESSAGES: Record<ErrorType, ErrorMessage> = {
  year: { error: 'Invalid year', status: 422 },
  month: { error: 'Invalid month', status: 422 },
  day: { error: 'Invalid day', status: 422 },
};

export const getErrorMessages = (type: ErrorType): ErrorMessage => ERROR_MESSAGES[type];
