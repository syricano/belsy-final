import { useState } from 'react';
import { toast } from 'react-hot-toast';

const AdminResponseModal = ({ isOpen, onClose, onSubmit }) => {
  const [message, setMessage] = useState('');

  const handleConfirm = () => {
    if (!message.trim()) return toast.error('Response cannot be empty');
    onSubmit(message);
    setMessage('');
    onClose();
  };

  return (
    <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Admin Response</h3>
        <textarea
          className="textarea textarea-bordered w-full mt-4"
          placeholder="Enter response message..."
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleConfirm}>Send</button>
        </div>
      </div>
    </dialog>
  );
};

export default AdminResponseModal;
