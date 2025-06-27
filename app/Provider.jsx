"use client";
import React, { useEffect } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import Header from "@/components/custom/Header";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/custom/AppSidebar";
import { ActionContext } from "@/context/ActionContext";
import { useRouter } from "next/navigation";
function Provider({ children }) {
  const [messages, setMessages] = useState([]);
  const [userDetail, setUserDetail] = useState();
  const [action, setAction] = useState();
  const router = useRouter();
  const convex = useConvex();

  useEffect(() => {
    IsAuth();
  }, []);

  const IsAuth = async () => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        router.push("/");
        return;
      }

      const result = await convex.query(api.users.GetUser, {
        email: user?.email,
      });
      console.log("User", result);
      if (result) {
        setUserDetail(result);
      }
    }
  };

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID}
    >
      <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
        <MessagesContext.Provider value={{ messages, setMessages }}>
          <ActionContext.Provider value={{ action, setAction }}>
            <NextThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
            >
              <SidebarProvider>
                <div className="flex flex-col w-full">
                  <Header />
                  {userDetail && <AppSidebar />}
                  {children}
                </div>
              </SidebarProvider>
            </NextThemeProvider>
          </ActionContext.Provider>
        </MessagesContext.Provider>
      </UserDetailContext.Provider>
    </GoogleOAuthProvider>
  );
}

export default Provider;
