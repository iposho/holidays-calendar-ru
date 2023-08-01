const errorStatus = 400;

const errorMessages = {
  year: { error: 'Invalid year', status: errorStatus },
  month: { error: 'Invalid month', status: errorStatus },
  day: { error: 'Invalid day', status: errorStatus },
  path: { error: 'Invalid API path', status: errorStatus },
  default: { error: 'Unknown error', status: errorStatus },
};

const getErrorMessages = (type = 'default') => {
  return errorMessages[type] || errorMessages.default;
};

module.exports = {
  getErrorMessages,
};
