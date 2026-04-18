import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/serverApi";
import NoteDetailsClient from "./NoteDetails.client";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);
    return {
      title: `${note.title} | NoteHub`,
      description:
        note.content
          ? note.content.slice(0, 160)
          : `View note "${note.title}" on NoteHub.`,
      openGraph: {
        title: `${note.title} | NoteHub`,
        description:
          note.content
            ? note.content.slice(0, 160)
            : `View note "${note.title}" on NoteHub.`,
        url: `https://notehub.app/notes/${id}`,
        images: [
          {
            url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          },
        ],
      },
    };
  } catch {
    return {
      title: "Note Not Found | NoteHub",
      description: "This note does not exist.",
    };
  }
}

export const dynamic = "force-dynamic";

export default async function NotePage({ params }: PageProps) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NoteDetailsClient noteId={id} />
    </HydrationBoundary>
  );
}
