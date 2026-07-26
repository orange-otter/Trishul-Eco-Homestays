import { useState } from 'react';
import { Modal, Button, Input } from './ui';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface ManageBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'edit' | 'cancel';
  booking: any;
  room: any;
  onSuccess: () => void;
}

export function ManageBookingModal({ isOpen, onClose, mode, booking, room, onSuccess }: ManageBookingModalProps) {
  const { session } = useAuth();
  const [checkIn, setCheckIn] = useState(booking?.check_in || '');
  const [checkOut, setCheckOut] = useState(booking?.check_out || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate days for editing
  const getDays = (start: string, end: string) => {
    if (!start || !end) return 0;
    const days = Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const newTotal = getDays(checkIn, checkOut) * (room?.price || 0);

  const handleEdit = async () => {
    if (!checkIn || !checkOut) {
      toast.error('Please select both dates');
      return;
    }
    const days = getDays(checkIn, checkOut);
    if (days <= 0) {
      toast.error('Check-out must be after check-in');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          check_in: checkIn,
          check_out: checkOut,
          total_price: newTotal
        })
      });
      if (!res.ok) throw new Error('Failed to update booking');
      toast.success('Trip dates updated successfully');
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update trip dates');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      if (!res.ok) throw new Error('Failed to cancel booking');
      toast.success('Trip cancelled successfully');
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to cancel trip');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!booking || !room) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={mode === 'edit' ? 'Modify Trip Dates' : 'Cancel Trip'}
    >
      {mode === 'edit' ? (
        <div className="flex flex-col gap-4 mt-2">
          <p className="text-sm text-text-secondary dark:text-gray-400 mb-2">
            Change your check-in and check-out dates for your stay at <strong className="text-text-primary dark:text-white">{room.name}</strong>.
          </p>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-primary dark:text-gray-300">Check-in Date</label>
            <Input 
              type="date" 
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-primary dark:text-gray-300">Check-out Date</label>
            <Input 
              type="date" 
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().split('T')[0]}
            />
          </div>

          {newTotal > 0 && (
            <div className="mt-2 p-4 bg-primary/10 dark:bg-primary-900/10 border border-primary/20 dark:border-primary/30 rounded-xl flex justify-between items-center">
              <span className="font-semibold text-text-primary dark:text-gray-300">New Total:</span>
              <span className="font-bold text-xl text-primary dark:text-primary-light">
                ₹{newTotal}
              </span>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border dark:border-gray-800">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Back</Button>
            <Button onClick={handleEdit} disabled={isSubmitting || newTotal <= 0}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-2">
          <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl">
            <p className="text-red-800 dark:text-red-400 font-medium">
              Are you absolutely sure you want to cancel your trip to <strong>{room.name}</strong>?
            </p>
            <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-2">
              This action cannot be undone. You will lose your reservation and any payments made will be refunded according to our cancellation policy.
            </p>
          </div>
          
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border dark:border-gray-800">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Keep Trip</Button>
            <button 
              onClick={handleCancel}
              disabled={isSubmitting}
              className="py-2.5 px-6 rounded-xl font-bold bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Cancelling...' : 'Yes, Cancel Trip'}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
