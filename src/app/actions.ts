"use server";

import { cookies } from "next/headers";

export async function setAuthToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get("authToken")?.value || null;
}

export async function deleteAuthToken() {
  const cookieStore = await cookies();
  cookieStore.delete("authToken");
}
