import { cookies } from "next/headers";
import { encrypt, decrypt } from "./jwt";
import { JWTPayload } from "jose";

export async function createSession(userId: string) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, expires });
  
  (await cookies()).set("session", session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession(): Promise<JWTPayload | null> {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  try {
    return await decrypt(session);
  } catch {
    return null;
  }
}

export async function destroySession() {
  (await cookies()).set("session", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}
