import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { format, formatDistance, isPast, isToday, parseISO } from "date-fns";
import DeleteReservation from "./DeleteReservation";
import Image from "next/image";
import Link from "next/link";

export const formatDistanceFromNow = (dateStr: string) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  }).replace("about ", "");

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

function ReservationCard({
  booking,
  onDelete,
}: {
  booking: Booking;
  onDelete: (id: number) => Promise<void>;
}) {
  const {
    id,
    guestId,
    startDate,
    endDate,
    numNights,
    totalPrice,
    numGuests,
    created_at,
    cabins,
  } = booking;
  const { name, image } = cabins;

  return (
    <div className="flex flex-col md:flex-row border border-primary-800">
      <div className="relative h-48 md:h-32 aspect-auto md:aspect-square">
        <Image
          fill
          src={image}
          sizes="(max-width: 768px) 100vw, 128px"
          alt={`Cabin ${name}`}
          className="object-cover border-b md:border-b-0 md:border-r border-primary-800"
        />
      </div>

      <div className="flex-grow px-4 md:px-6 py-3 flex flex-col gap-2 md:gap-0">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            {numNights} nights in Cabin {name}
          </h3>
          {isPast(new Date(startDate)) ? (
            <span className="bg-yellow-800 text-yellow-200 h-7 px-3 uppercase text-xs font-bold flex items-center rounded-sm">
              past
            </span>
          ) : (
            <span className="bg-green-800 text-green-200 h-7 px-3 uppercase text-xs font-bold flex items-center rounded-sm">
              upcoming
            </span>
          )}
        </div>

        <p className="text-lg text-primary-300">
          {format(new Date(startDate), "EEE, MMM dd yyyy")} (
          {isToday(new Date(startDate))
            ? "Today"
            : formatDistanceFromNow(startDate)}
          ) &mdash; {format(new Date(endDate), "EEE, MMM dd yyyy")}
        </p>

        <div className="flex flex-wrap gap-3 md:gap-5 mt-auto items-baseline">
          <p className="text-xl font-semibold text-accent-400">${totalPrice}</p>
          <p className="text-primary-300 hidden md:block">&bull;</p>
          <p className="text-lg text-primary-300">
            {numGuests} guest{numGuests > 1 && "s"}
          </p>
          <p className="text-xs md:text-sm text-primary-400 md:ml-auto w-full md:w-auto">
            Booked {format(new Date(created_at), "EEE, MMM dd yyyy, p")}
          </p>
        </div>
      </div>

      <div className="flex flex-row md:flex-col border-t md:border-t-0 md:border-l border-primary-800 md:w-[100px]">
        {isPast(startDate) ? null : (
          <>
            <Link
              href={`/account/reservations/edit/${id}`}
              className="group flex justify-center md:justify-start items-center gap-2 uppercase text-xs font-bold text-primary-300 border-r md:border-r-0 md:border-b border-primary-800 flex-1 md:flex-grow py-3 md:py-0 px-3 hover:bg-accent-600 transition-colors hover:text-primary-900"
            >
              <PencilSquareIcon className="h-5 w-5 text-primary-600 group-hover:text-primary-800 transition-colors" />
              <span className="mt-1">Edit</span>
            </Link>
            <DeleteReservation onDelete={onDelete} bookingId={id} />
          </>
        )}
        {/* bookingId={id} */}
      </div>
    </div>
  );
}

export default ReservationCard;
