"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { checkSession, getMe, logout } from "@/lib/api/clientApi";

const PRIVATE_ROUTES = ["/profile", "/notes"];

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [isChecking, setIsChecking] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { setUser, clearIsAuthenticated, isAuthenticated } = useAuthStore();

  const isPrivateRoute = PRIVATE_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  useEffect(() => {
    const verify = async () => {
      try {
        const isActive = await checkSession();
        if (isActive) {
          const user = await getMe();
          setUser(user);
        } else {
          clearIsAuthenticated();
          if (isPrivateRoute) {
            await logout().catch(() => {});
            router.replace("/sign-in");
          }
        }
      } catch {
        clearIsAuthenticated();
        if (isPrivateRoute) {
          router.replace("/sign-in");
        }
      } finally {
        setIsChecking(false);
      }
    };

    verify();
  }, [pathname]);

  if (isChecking && isPrivateRoute) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated && isPrivateRoute && !isChecking) {
    return null;
  }

  return <>{children}</>;
}