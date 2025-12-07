// src/hooks/useFeedback.js
import { useEffect, useState } from 'react';
import { getPublicFeedback } from '@/data/feedback';
import { errorHandler } from '@/utils';

const useFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedback = async () => {
    try {
      const data = await getPublicFeedback();
      setFeedbacks(data);
    } catch (err) {
      errorHandler(err, 'Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  return { feedbacks, loading, refetch: fetchFeedback };
};

export default useFeedback;
