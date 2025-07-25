import { useEffect, useState } from 'react';
import {
  getAllFeedback,
  updateFeedback,
  deleteFeedback
} from '@/data/feedback';
import { errorHandler } from '@/utils';
import { toast } from 'react-hot-toast';
import ActionButton from '@/components/UI/ActionButton';

const FeedbackManager = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [replyingId, setReplyingId] = useState(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    try {
      const data = await getAllFeedback();
      setFeedbacks(data);
    } catch (err) {
      errorHandler(err, 'Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleReply = async (id) => {
    try {
      await updateFeedback(id, { adminReply: reply });
      toast.success('Reply saved');
      setReplyingId(null);
      setReply('');
      fetchFeedbacks();
    } catch (err) {
      errorHandler(err, 'Failed to save reply');
    }
  };

  const handleDeleteReply = async (id) => {
    try {
      await updateFeedback(id, { adminReply: '' });
      toast.success('Reply removed');
      fetchFeedbacks();
    } catch (err) {
      errorHandler(err, 'Failed to remove reply');
    }
  };

  const handleDeleteFeedback = async (id) => {
    const confirmed = window.confirm('Delete this feedback?');
    if (!confirmed) return;

    try {
      await deleteFeedback(id);
      toast.success('Feedback deleted');
      fetchFeedbacks();
    } catch (err) {
      errorHandler(err, 'Delete failed');
    }
  };

  return (
    <section className="space-y-8">
      <h2 className="text-3xl font-serif font-semibold text-[var(--bc)] text-center">
        All Feedback
      </h2>

      {loading ? (
        <div className="w-full flex justify-center py-10">
          <span className="loading loading-spinner text-[var(--bc)] w-10 h-10" />
        </div>
      ) : feedbacks.length === 0 ? (
        <p className="text-center text-[var(--bc)] opacity-60">No feedback available.</p>
      ) : (
        <div className="space-y-6">
          {feedbacks.map((fb) => (
            <div
              key={fb.id}
              className="bg-[var(--b1)] text-[var(--bc)] p-4 rounded-xl shadow border border-[var(--border-color)] space-y-2"
            >
              <p className="italic mb-1">“{fb.message}”</p>
              <div className="text-sm flex justify-between opacity-70">
                <span>Name: {fb.name || 'Anonymous'}</span>
                {fb.rating && <span>★ {fb.rating}</span>}
              </div>

              {fb.adminReply && (
                <div className="bg-[var(--n)] text-[var(--nc)] text-sm p-3 rounded border mt-2">
                  <p className="italic">Admin Reply:</p>
                  <p>{fb.adminReply}</p>
                  <div className="flex gap-2 mt-2">
                    <ActionButton
                      type="reply"
                      onClick={() => {
                        setReplyingId(fb.id);
                        setReply(fb.adminReply || '');
                      }}
                      label="Edit Reply"
                    />
                    <ActionButton
                      type="delete"
                      onClick={() => handleDeleteReply(fb.id)}
                      label="Delete Reply"
                    />
                  </div>
                </div>
              )}

              {replyingId === fb.id ? (
                <div className="space-y-2 mt-4">
                  <textarea
                    rows="3"
                    className="textarea textarea-bordered w-full bg-[var(--b1)] text-[var(--bc)]"
                    placeholder="Write admin reply..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <ActionButton
                      type="approve"
                      label="Save Reply"
                      onClick={() => handleReply(fb.id)}
                    />
                    <ActionButton
                      type="decline"
                      label="Cancel"
                      onClick={() => setReplyingId(null)}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 mt-3">
                  <ActionButton
                    type="reply"
                    label="Reply"
                    onClick={() => {
                      setReplyingId(fb.id);
                      setReply(fb.adminReply || '');
                    }}
                  />

                  <ActionButton
                    type="delete"
                    label="Delete"
                    onClick={() => handleDeleteFeedback(fb.id)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default FeedbackManager;
