"use client";

import { useOptimistic, useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { deleteBooking, loadMoreBookings } from "../_lib/actions";
import ReservationCard from "./ReservationCard";
import toast from "react-hot-toast";
import SpinnerMini from "./SpinnerMini";

interface Booking {
  id: number;
  guestId: number;
  startDate: string;
  endDate: string;
  numNights: number;
  totalPrice: number;
  numGuests: number;
  created_at: string;
  cabins: {
    name: string;
    image: string;
  };
}

function ReservationList({ bookings }: { bookings: Booking[] }) {
  const [localBookings, setLocalBookings] = useState(bookings);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(bookings.length === 5); // Default limit is 5 in data-service
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasMore) {
      loadMoreBookings(page)
        .then((newBookings) => {
          if (newBookings.length === 0) {
            setHasMore(false);
          } else {
            setLocalBookings((prev) => {
               // Filter possible duplicates if any
               const existingIds = prev.map(b => b.id);
               const uniqueNew = newBookings.filter(b => !existingIds.includes(b.id));
               return [...prev, ...uniqueNew];
            });
            setPage((p) => p + 1);
            if (newBookings.length < 5) setHasMore(false);
          }
        })
        .catch(() => toast.error("Failed to load more reservations"));
    }
  }, [inView, hasMore, page]);

  //乐观UI
  const [optimistcBookings, optimisticDelete] = useOptimistic(
    localBookings,
    (curBookings, bookingId: number) => {
      return curBookings.filter((booking) => booking.id !== bookingId);
    },
  );

  async function handleDelete(bookingId: number) {
    optimisticDelete(bookingId);
    try {
      const res = await deleteBooking(bookingId);
      if (res?.error) {
         toast.error(res.error);
      } else {
         toast.success("Reservation deleted successfully!");
         setLocalBookings((prev) => prev.filter((b) => b.id !== bookingId));
      }
    } catch {
      toast.error("Failed to delete reservation");
    }
  }
  return (
    <ul className="space-y-6">
      {optimistcBookings.map((booking) => (
        <ReservationCard
          onDelete={handleDelete}
          booking={booking}
          key={booking.id}
        />
      ))}
      
      {/* Infinite Scroll Sentinel */}
      {hasMore && (
        <div ref={ref} className="flex justify-center items-center py-6">
           <SpinnerMini />
        </div>
      )}
    </ul>
  );
}

export default ReservationList;
