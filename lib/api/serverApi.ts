import axios from "axios";
import { cookies } from "next/headers";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";

async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.toString();
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  page: number,
  search?: string,
  tag?: string
): Promise<FetchNotesResponse> => {
  const cookieHeader = await getCookieHeader();
  const { data } = await axios.get<FetchNotesResponse>(`${baseURL}/notes`, {
    params: {
      page,
      perPage: 12,
      ...(search ? { search } : {}),
      ...(tag ? { tag } : {}),
    },
    headers: { Cookie: cookieHeader },
    withCredentials: true,
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieHeader = await getCookieHeader();
  const { data } = await axios.get<Note>(`${baseURL}/notes/${id}`, {
    headers: { Cookie: cookieHeader },
    withCredentials: true,
  });
  return data;
};

export const getMe = async (): Promise<User> => {
  const cookieHeader = await getCookieHeader();
  const { data } = await axios.get<User>(`${baseURL}/users/me`, {
    headers: { Cookie: cookieHeader },
    withCredentials: true,
  });
  return data;
};

export const checkSession = async () => {
  const cookieHeader = await getCookieHeader();
  const response = await axios.get(`${baseURL}/auth/session`, {
    headers: { Cookie: cookieHeader },
    withCredentials: true,
  });
  return response;
};