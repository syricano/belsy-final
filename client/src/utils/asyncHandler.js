export const asyncHandler = async (callback, fallbackMessage = 'Something went wrong') => {
  try {
    const result = await callback();
    return result?.data || result;
  } catch (error) {
    const message =
      error?.response?.data?.error || error?.message || fallbackMessage;
    console.error('[ERROR]', message);
    throw new Error(message);
  }
};
