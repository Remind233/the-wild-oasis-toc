"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function updateProfileAction(formData: FormData) {
  //认证
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  // 2. 提取并验证表单字段
  const rawNationality = formData.get("nationality");
  const rawNationalID = formData.get("nationalID");

  if (typeof rawNationality !== "string" || typeof rawNationalID !== "string") {
    throw new Error("Invalid form data");
  }

  // 3. 解析 nationality 字段（格式 "国家名%国旗URL"）
  const [nationality, countryFlag] = rawNationality.split("%");
  if (!nationality || !countryFlag) {
    throw new Error("Invalid nationality format");
  }

  // 4. 验证 nationalID（6-12位字母数字）
  if (!/^[a-zA-Z0-9]{6,12}$/.test(rawNationalID)) {
    throw new Error(
      "Please provide a valid national ID (6-12 alphanumeric characters)",
    );
  }

  const updateData = { nationality, countryFlag, nationalID: rawNationalID };

  const { error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session?.user?.guestId);

  if (error) {
    console.error("Supabase update error:", error);
    throw new Error("Guest could not be updated");
  }

  // 8. 重新验证页面缓存并重定向
  revalidatePath("/account/profile");
  redirect("/account/profile");
}

export async function deleteBooking(bookingId: number) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  if (!session?.user?.guestId) return;
  const guestBookings = await getBookings(session?.user?.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) {
    throw new Error("Booking could not be deleted");
  }

  revalidatePath("/account/reservations");
}

export async function updateBooking(formData: FormData) {
  //认证
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  //授权
  if (!session?.user?.guestId) return;
  const guestBookings = await getBookings(session?.user?.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  const bookingId = Number(formData.get("bookingId"));
  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to update this booking");

  //更新数据
  const updatedData = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations")?.toString().slice(0, 1000),
  };

  //更新
  const { error } = await supabase
    .from("bookings")
    .update(updatedData)
    .eq("id", bookingId)
    .select()
    .single();

  //错误处理
  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }

  //重新验证缓存
  revalidatePath("/account/reservations");
  revalidatePath(`/account/reservations/edit/${bookingId}`);

  //重定向
  redirect("/account/reservations");
}

interface BookingData {
  startDate: Date; // 开始日期
  endDate: Date; // 结束日期
  numNights: number; // 住宿晚数
  cabinPrice: number; // 小屋总价
  cabinId: number; // 小屋 ID
}

export async function createBooking(
  bookingData: BookingData,
  formData: FormData,
) {
  console.log(bookingData, formData);
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const Booking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations")?.toString().slice(0, 1000),
    extraPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  const { error } = await supabase.from("bookings").insert([Booking]);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }

  //重新验证缓存
  revalidatePath(`/cabins/${bookingData.cabinId}`);

  //重定向
  redirect("/cabins/thankyou");
}
