export function getApiErrorMessage(error, fallbackMessage = 'Ocorreu um erro. Tente novamente.') {
  if (!error) return fallbackMessage;

  // Axios: error.response.data pode ser string, objeto, blob, etc.
  const data = error.response?.data;

  if (typeof data === 'string' && data.trim()) return data;

  if (data && typeof data === 'object') {
    if (typeof data.message === 'string' && data.message.trim()) return data.message;
    if (typeof data.error === 'string' && data.error.trim()) return data.error;
    if (typeof data.detail === 'string' && data.detail.trim()) return data.detail;
  }

  if (typeof error.message === 'string' && error.message.trim()) return error.message;

  return fallbackMessage;
}

