import type { Metadata } from "next";
import css from "./not-found.module.css";

export const metadata: Metadata = {
  title: "404 - Page Not Found | NoteHub",
  description: "This page does not exist. Please check the URL or return to NoteHub.",
  openGraph: {
    title: "404 - Page Not Found | NoteHub",
    description: "This page does not exist. Please check the URL or return to NoteHub.",
    url: "https://notehub.app/not-found",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
      },
    ],
  },
};

export default function NotFound() {
  return (
    <div className={css.container}>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
}
