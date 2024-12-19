interface ErrorMessage {
  error: string;
  status: number;
}

export const getErrorMessages = (type: string = ''): ErrorMessage => {
  switch (type) {
    case 'year':
      return { error: 'Invalid year', status: 422 };
    case 'month':
      return { error: 'Invalid month', status: 422 };
    case 'day':
      return { error: 'Invalid day', status: 422 };
    case 'not_found':
      return { error: 'Resource not found', status: 404 };
    default:
      return { error: 'Unknown error', status: 400 };
  }
};
