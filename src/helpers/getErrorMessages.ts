const status = 400;

interface ErrorMessage {
  error: string;
  status: number;
}

export const getErrorMessages = (type: string = ''): ErrorMessage => {
  switch (type) {
    case 'year':
      return { error: 'Invalid year', status };
    case 'month':
      return { error: 'Invalid month', status };
    case 'day':
      return { error: 'Invalid day', status };
    case 'path':
      return { error: 'Invalid API path', status };
    default:
      return { error: 'Unknown error', status };
  }
};
