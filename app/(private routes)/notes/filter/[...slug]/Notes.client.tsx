"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { fetchNotes } from "@/lib/api/clientApi";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import Link from "next/link";
import css from "@/app/notes/NotesPage.module.css";

interface Props {
  activeTag?: string;
}

export default function NotesClient({ activeTag }: Props) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, search, activeTag],
    queryFn: () => fetchNotes(page, search, activeTag),
    staleTime: 500,
    placeholderData: (prev) => prev,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (isError) return <p>Could not fetch the list of notes.</p>;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={debouncedSearch} />
        {(data?.totalPages ?? 0) > 1 && (
          <Pagination
            pageCount={data?.totalPages ?? 1}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      <NoteList notes={data?.notes ?? []} />
    </div>
  );
}
