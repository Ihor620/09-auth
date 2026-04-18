"use client";

export default function FilterError({ error }: { error: Error }) {
  return <p>Could not load notes. {error.message}</p>;
}