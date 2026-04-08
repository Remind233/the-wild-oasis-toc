// "use client";

// import { useState } from "react";
// import { useReservation } from "./ReservationContext";
// import Image from "next/image";
// import { differenceInDays } from "date-fns";
// import { createBooking } from "../_lib/actions";
// import SubmitButton from "./SubmitButton";

// interface Cabins {
//   id: number;
//   name: string;
//   maxCapacity: number;
//   regularPrice: number;
//   discount: number;
//   description: string;
//   image: string;
// }

// interface User {
//   name?: string | null;
//   email?: string | null;
//   image?: string | null;
// }

// function ReservationForm({ cabin, user }: { cabin: Cabins; user: User }) {
//   // CHANGE
//   const { range, resetRange } = useReservation();
//   const { maxCapacity, regularPrice, discount, id } = cabin;
//   const startDate = range?.from;
//   const endDate = range?.to;
//   const numNights =
//     startDate && endDate ? differenceInDays(endDate, startDate) : 0;
//   const cabinPrice = numNights * (regularPrice - discount);

//   const bookingData = {
//     startDate,
//     endDate,
//     numNights,
//     cabinPrice,
//     cabinId: id,
//   };

//   const createBookingWithData = createBooking.bind(null, bookingData);

//   // 状态管理头像源，失败时切换到默认头像
//   const [imgSrc, setImgSrc] = useState(user.image ?? "/default-avatar.jpg");
//   const handleImageError = () => {
//     setImgSrc("/default-avatar.jpg");
//   };

//   return (
//     <div className="scale-[1.01]">
//       <div className="bg-primary-800 text-primary-300 px-16 py-2 flex justify-between items-center">
//         <p>Logged in as</p>

//         <div className="flex gap-4 items-center">
//           <Image
//             src={imgSrc}
//             alt={user.name ?? "User"}
//             width={32}
//             height={32}
//             className="h-8 rounded-full object-cover"
//             referrerPolicy="no-referrer"
//             onError={handleImageError}
//           />
//           <p>{user.name}</p>
//         </div>
//       </div>

//       <form
//         action={async (formData) => {
//           await createBookingWithData(formData);
//           resetRange();
//         }}
//         className="bg-primary-900 py-10 px-16 text-lg flex gap-5 flex-col"
//       >
//         <div className="space-y-2">
//           <label htmlFor="numGuests">How many guests?</label>
//           <select
//             name="numGuests"
//             id="numGuests"
//             className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
//             required
//           >
//             <option value="" key="">
//               Select number of guests...
//             </option>
//             {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
//               <option value={x} key={x}>
//                 {x} {x === 1 ? "guest" : "guests"}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="space-y-2">
//           <label htmlFor="observations">
//             Anything we should know about your stay?
//           </label>
//           <textarea
//             name="observations"
//             id="observations"
//             className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
//             placeholder="Any pets, allergies, special requirements, etc.?"
//           />
//         </div>

//         <div className="flex justify-end items-center gap-6">
//           {!(startDate && endDate) ? (
//             <p className="text-primary-300 text-base">
//               Start by selecting dates
//             </p>
//           ) : (
//             <SubmitButton pendingLabel="Reserving...">Reserve now</SubmitButton>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// }

// export default ReservationForm;
"use client";

import { useState } from "react";
import { useReservation } from "./ReservationContext";
import Image from "next/image";
import { differenceInDays } from "date-fns";
import { createBooking } from "../_lib/actions";
import SubmitButton from "./SubmitButton";
import toast from "react-hot-toast";

interface Cabins {
  id: number;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  image: string;
}

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

function ReservationForm({ cabin, user }: { cabin: Cabins; user: User }) {
  const { range, resetRange } = useReservation();
  const { maxCapacity, regularPrice, discount, id } = cabin;
  const startDate = range?.from;
  const endDate = range?.to;
  const numNights =
    startDate && endDate ? differenceInDays(endDate, startDate) : 0;
  const cabinPrice = numNights * (regularPrice - discount);

  // 状态管理头像源，失败时切换到默认头像
  const [imgSrc, setImgSrc] = useState(user.image ?? "/default-avatar.jpg");
  const handleImageError = () => {
    setImgSrc("/default-avatar.jpg");
  };

  return (
    <div className="scale-[1.01]">
      <div className="bg-primary-800 text-primary-300 px-6 md:px-16 py-2 flex justify-between items-center">
        <p>Logged in as</p>
        <div className="flex gap-4 items-center">
          <Image
            src={imgSrc}
            alt={user.name ?? "User"}
            width={32}
            height={32}
            className="h-8 rounded-full object-cover"
            referrerPolicy="no-referrer"
            onError={handleImageError}
          />
          <p>{user.name}</p>
        </div>
      </div>

      <form
        action={async (formData) => {
          if (!startDate || !endDate) {
            return;
          }
          const bookingData = {
            startDate,
            endDate,
            numNights,
            cabinPrice,
            cabinId: id,
          };
          const res = await createBooking(bookingData, formData);
          
          if (res?.error) {
             toast.error(res.error);
          } else {
             resetRange();
          }
        }}
        className="bg-primary-900 py-10 px-6 md:px-16 text-lg flex gap-5 flex-col"
      >
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          >
            <option value="">Select number of guests...</option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            id="observations"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            placeholder="Any pets, allergies, special requirements, etc.?"
          />
        </div>

        <div className="flex justify-end items-center gap-6">
          {!startDate || !endDate ? (
            <p className="text-primary-300 text-base">
              Start by selecting dates
            </p>
          ) : (
            <SubmitButton pendingLabel="Reserving...">Reserve now</SubmitButton>
          )}
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
