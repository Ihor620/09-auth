import instance from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
}

export const fetchNotes = async (
  page: number,
  search?: string,
  tag?: string
): Promise<FetchNotesResponse> => {
  const { data } = await instance.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage: 12,
      ...(search ? { search } : {}),
      ...(tag ? { tag } : {}),
    },
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await instance.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (
  note: Omit<Note, "id" | "createdAt" | "updatedAt">
): Promise<Note> => {
  const { data } = await instance.post<Note>("/notes", note);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await instance.delete<Note>(`/notes/${id}`);
  return data;
};

export const register = async (
  credentials: AuthCredentials
): Promise<AuthResponse> => {
  const { data } = await instance.post<AuthResponse>(
    "/auth/register",
    credentials
  );
  return data;
};

export const login = async (
  credentials: AuthCredentials
): Promise<AuthResponse> => {
  const { data } = await instance.post<AuthResponse>(
    "/auth/login",
    credentials
  );
  return data;
};

export const logout = async (): Promise<void> => {
  await instance.post("/auth/logout");
};

export const checkSession = async (): Promise<boolean> => {
  const { data } = await instance.get<{ success: boolean }>("/auth/session");
  return data?.success === true;
};

export const getMe = async (): Promise<User> => {
  const { data } = await instance.get<User>("/users/me");
  return data;
};

export const updateMe = async (updates: { username: string }): Promise<User> => {
  const { data } = await instance.patch<User>("/users/me", updates);
  return data;
};