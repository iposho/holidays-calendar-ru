const status = 400;

const getErrorMessages = (type = '') => {
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

module.exports = {
  getErrorMessages,
};
