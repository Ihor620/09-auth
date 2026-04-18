"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import Modal from "@/components/Modal/Modal";
import NotePreview from "@/components/NotePreview/NotePreview";

interface Props {
  noteId: string;
}

export default function NotePreviewClient({ noteId }: Props) {
  const router = useRouter();

  const { data: note, isLoading, isError } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
    refetchOnMount: false,
  });

  if (isLoading) return null;
  if (isError || !note) return null;

  return (
    <Modal onClose={() => router.back()}>
      <NotePreview note={note} />
    </Modal>
  );
}