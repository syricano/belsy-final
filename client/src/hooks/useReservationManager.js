import { useEffect, useState } from 'react';
import {
  getAllReservations,
  approveReservation,
  declineReservation,
  updateReservation,
  cancelReservation,
} from '@/data';
import { asyncHandler, errorHandler } from '@/utils';
import { toast } from 'react-hot-toast';

const normalize = (value) => (value || '').toLowerCase().trim();

const useReservationManager = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const [editingReservation, setEditingReservation] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [filteredReservations, setFilteredReservations] = useState([]);
  const [filterActive, setFilterActive] = useState(false);

  const fetchReservations = () => {
    setLoading(true);
    asyncHandler(getAllReservations, 'Failed to load reservations')
        .then((data) => {
            console.log('[fetchReservations] Got reservations:', data);
            setReservations(data);
            setFilterActive(false);            // ✅ reset filter status
            setFilteredReservations([]);       // ✅ clear any stale filters
        })
        .catch(errorHandler)
        .finally(() => setLoading(false));
    };


  useEffect(() => {
    console.log('[useEffect] fetchReservations called');
    fetchReservations();
  }, []);

  const handleActionClick = (id, action) => {
    setSelectedId(id);
    setSelectedAction(action);
    setModalOpen(true);
  };

  const handleAdminSubmit = (responseText) => {
    const service = selectedAction === 'approve' ? approveReservation : declineReservation;
    asyncHandler(() => service(selectedId, responseText), `Failed to ${selectedAction}`)
      .then(() => {
        toast.success(`Reservation ${selectedAction}d`);
        fetchReservations();
      })
      .catch(errorHandler);
  };

  const handleUpdate = (reservation) => {
    setEditingReservation(reservation);
    setShowEditModal(true);
  };

  const handleCancelation = (id) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;

    asyncHandler(() => cancelReservation(id), 'Cancelation failed')
      .then(() => {
        toast.success('Reservation canceled');
        fetchReservations();
      })
      .catch(errorHandler);
  };

  const handleUpdateSuccess = () => {
    setShowEditModal(false);
    fetchReservations();
  };

  const handleSearch = (filters) => {
    const normalize = (val) => (val || '').toLowerCase().trim();

    const normalizedFilters = {
        name: normalize(filters.name).trim(),
        email: normalize(filters.email).trim(),
        phone: normalize(filters.phone).trim(),
        date: filters.date?.trim(), // leave date as-is, just trim
    };

    const hasAnyFilter = Object.values(normalizedFilters).some(val => !!val);

    if (!hasAnyFilter) {
        setFilterActive(false);
        setFilteredReservations([]);
        return;
    }

    const result = reservations.filter((res) => {
        const dateStr = new Date(res.reservationTime).toISOString().split('T')[0];
        const guestName = normalize(res.guestName || res.User?.firstName);
        const guestEmail = normalize(res.guestEmail || res.User?.email);
        const guestPhone = normalize(res.guestPhone || res.User?.phone);

        return (
        (!normalizedFilters.name || guestName.includes(normalizedFilters.name)) &&
        (!normalizedFilters.email || guestEmail.includes(normalizedFilters.email)) &&
        (!normalizedFilters.phone || guestPhone.includes(normalizedFilters.phone)) &&
        (!normalizedFilters.date || dateStr === normalizedFilters.date)
        );
        
    });

    setFilteredReservations(result);
    setFilterActive(true);
};


  return {
    reservations,
    loading,
    filteredReservations,
    filterActive,
    modalOpen,
    selectedAction,
    selectedId,
    editingReservation,
    showEditModal,

    handleActionClick,
    handleAdminSubmit,
    handleUpdate,
    handleCancelation,
    handleUpdateSuccess,
    handleSearch,

    setModalOpen,
    setShowEditModal,
  };
};

export default useReservationManager;
