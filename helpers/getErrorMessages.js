const getErrorMessages = (type = '') => {
  switch (type) {
    case 'year':
      return { error: 'Invalid year', status: 400 };
    case 'month':
      return { error: 'Invalid month', status: 400 };
    case 'day':
      return { error: 'Invalid day', status: 400 };
    case 'path':
      return { error: 'Invalid API path', status: 400 };
    default:
      return { error: 'Unknown error', status: 400 };
  }
};

module.exports = {
  getErrorMessages,
};
