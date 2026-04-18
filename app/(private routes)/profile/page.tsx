import Image from "next/image";
import Link from "next/link";
import { getMe } from "@/lib/api/serverApi";
import type { Metadata } from "next";
import css from "./profile.module.css";

export const metadata: Metadata = {
  title: "Profile | NoteHub",
  description: "View your NoteHub profile information.",
  openGraph: {
    title: "Profile | NoteHub",
    description: "View your NoteHub profile information.",
    url: "https://notehub.app/profile",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
      },
    ],
  },
};

export default async function ProfilePage() {
  let user = null;
  try {
    user = await getMe();
  } catch {
    // user stays null — AuthProvider handles redirect
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt="User Avatar"
              width={120}
              height={120}
              className={css.avatar}
            />
          ) : (
            <div className={css.avatarPlaceholder} />
          )}
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user?.username ?? "—"}</p>
          <p>Email: {user?.email ?? "—"}</p>
        </div>
      </div>
    </main>
  );
}