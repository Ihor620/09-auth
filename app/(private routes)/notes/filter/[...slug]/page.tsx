import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tagValue = slug?.[0];
  const activeTag = !tagValue || tagValue === "all" ? "All" : tagValue;

  return {
    title: `${activeTag} Notes | NoteHub`,
    description: `Browse your ${activeTag === "All" ? "all" : activeTag} notes in NoteHub.`,
    openGraph: {
      title: `${activeTag} Notes | NoteHub`,
      description: `Browse your ${activeTag === "All" ? "all" : activeTag} notes in NoteHub.`,
      url: `https://notehub.app/notes/filter/${tagValue ?? "all"}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        },
      ],
    },
  };
}

export const dynamic = "force-dynamic";

export default async function FilterPage({ params }: PageProps) {
  const { slug } = await params;

  const tagValue = slug?.[0];
  const activeTag =
    !tagValue || tagValue === "all" ? undefined : tagValue;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", activeTag],
    queryFn: () => fetchNotes(1, "", activeTag),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotesClient activeTag={activeTag} />
    </HydrationBoundary>
  );
}
