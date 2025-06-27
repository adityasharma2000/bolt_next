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
  const [isMounted, setIsMounted] = useState(false);
  const [showAnimations, setShowAnimations] = useState(false);
  const [mathSymbolsPositions, setMathSymbolsPositions] = useState([]);
  const [particlePositions, setParticlePositions] = useState([]);
  const router = useRouter();
  const convex = useConvex();

  useEffect(() => {
    // Set mounted to true to prevent hydration issues
    setIsMounted(true);
    
    // Generate random positions for math symbols after hydration
    const mathSymbols = ['∑', '∞', 'π', '√', '∆', '∫', 'α', 'β', 'γ', 'θ', '±', '÷', '×', '≤', '≥', '≠', '≈', '∝'];
    const symbolPositions = mathSymbols.map((symbol, index) => ({
      symbol,
      left: Math.random() * 100,
      top: Math.random() * 100,
      fontSize: Math.random() * 20 + 15,
      animationDelay: Math.random() * 20,
    }));
    setMathSymbolsPositions(symbolPositions);
    
    // Generate random positions for particles after hydration
    const particles = [...Array(20)].map((_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: Math.random() * 10,
      animationDuration: Math.random() * 10 + 10,
    }));
    setParticlePositions(particles);
    
    // Start animations with a smooth fade-in after a brief delay
    const animationTimer = setTimeout(() => {
      setShowAnimations(true);
    }, 100);
    
    IsAuth();
    
    return () => {
      clearTimeout(animationTimer);
    };
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

  // Show loading state before hydration to prevent mismatch
  if (!isMounted) {
    return (
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID}
      >
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
          <MessagesContext.Provider value={{ messages, setMessages }}>
            <ActionContext.Provider value={{ action, setAction }}>
              <NextThemeProvider
                attribute="class"
                defaultTheme="light"
                forcedTheme="light"
                enableSystem={false}
              >
                <SidebarProvider>
                  <div className="relative flex flex-col w-full min-h-screen overflow-hidden">
                    {/* Static background during loading */}
                    <div className="fixed inset-0 z-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
                    </div>

                    {/* Main Content */}
                    <div className="relative z-10 flex flex-col w-full">
                      <Header />
                      {userDetail && <AppSidebar />}
                      {children}
                    </div>
                  </div>
                </SidebarProvider>
              </NextThemeProvider>
            </ActionContext.Provider>
          </MessagesContext.Provider>
        </UserDetailContext.Provider>
      </GoogleOAuthProvider>
    );
  }

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID}
    >
      <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
        <MessagesContext.Provider value={{ messages, setMessages }}>
          <ActionContext.Provider value={{ action, setAction }}>
            <NextThemeProvider
              attribute="class"
              defaultTheme="light"
              forcedTheme="light"
              enableSystem={false}
            >
              <SidebarProvider>
                <div className="relative flex flex-col w-full min-h-screen overflow-hidden">
                                      {/* Unified Animated Background */}
                    <div className="fixed inset-0 z-0">
                      {/* Gradient Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
                      
                      {/* Animated Gradient Orbs */}
                      <div className={`absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl transition-opacity duration-1000 ${showAnimations ? 'opacity-20 animate-blob' : 'opacity-0'}`}></div>
                      <div className={`absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl transition-opacity duration-1000 ${showAnimations ? 'opacity-20 animate-blob animation-delay-2000' : 'opacity-0'}`}></div>
                      <div className={`absolute bottom-20 left-40 w-72 h-72 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full mix-blend-multiply filter blur-xl transition-opacity duration-1000 ${showAnimations ? 'opacity-20 animate-blob animation-delay-4000' : 'opacity-0'}`}></div>
                      <div className={`absolute top-60 right-60 w-48 h-48 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl transition-opacity duration-1000 ${showAnimations ? 'opacity-15 animate-blob animation-delay-6000' : 'opacity-0'}`}></div>
                    
                                          {/* Floating Mathematical Symbols */}
                      {mathSymbolsPositions.map((item, index) => (
                        <div
                          key={index}
                          className={`absolute text-blue-200 font-bold select-none pointer-events-none transition-opacity duration-1000 ${showAnimations ? 'opacity-40' : 'opacity-0'}`}
                          style={{
                            left: `${item.left}%`,
                            top: `${item.top}%`,
                            fontSize: `${item.fontSize}px`,
                            animationDelay: `${item.animationDelay}s`,
                          }}
                        >
                          <div className={showAnimations ? 'animate-float-slow' : ''}>{item.symbol}</div>
                        </div>
                      ))}
                    
                                          {/* Geometric Shapes */}
                      <div className={`absolute top-1/4 left-1/4 transition-opacity duration-1000 ${showAnimations ? 'opacity-30' : 'opacity-0'}`}>
                        <div className={`w-4 h-4 border-2 border-blue-300 rotate-45 ${showAnimations ? 'animate-spin-slow' : ''}`}></div>
                      </div>
                      <div className={`absolute top-3/4 right-1/4 transition-opacity duration-1000 ${showAnimations ? 'opacity-30' : 'opacity-0'}`}>
                        <div className={`w-6 h-6 border-2 border-purple-300 rounded-full ${showAnimations ? 'animate-pulse' : ''}`}></div>
                      </div>
                      <div className={`absolute top-1/2 left-3/4 transition-opacity duration-1000 ${showAnimations ? 'opacity-30' : 'opacity-0'}`}>
                        <div className={`w-3 h-8 bg-gradient-to-t from-pink-300 to-purple-300 ${showAnimations ? 'animate-bounce' : ''}`}></div>
                      </div>
                      <div className={`absolute bottom-1/3 right-1/2 transition-opacity duration-1000 ${showAnimations ? 'opacity-25' : 'opacity-0'}`}>
                        <div className={`w-2 h-6 bg-gradient-to-b from-cyan-300 to-blue-300 ${showAnimations ? 'animate-pulse' : ''}`}></div>
                      </div>
                    
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="h-full w-full bg-grid-pattern"></div>
                    </div>
                    
                                          {/* Floating Particles */}
                      {particlePositions.map((particle, i) => (
                        <div
                          key={`particle-${i}`}
                          className={`absolute w-2 h-2 bg-blue-400 rounded-full transition-opacity duration-1000 ${showAnimations ? 'opacity-20 animate-float' : 'opacity-0'}`}
                          style={{
                            left: `${particle.left}%`,
                            top: `${particle.top}%`,
                            animationDelay: `${particle.animationDelay}s`,
                            animationDuration: `${particle.animationDuration}s`,
                          }}
                        ></div>
                      ))}
                  </div>

                  {/* Main Content */}
                  <div className="relative z-10 flex flex-col w-full">
                    <Header />
                    {userDetail && <AppSidebar />}
                    {children}
                  </div>

                  {/* Custom Styles */}
                  <style jsx global>{`
                    @keyframes blob {
                      0% {
                        transform: translate(0px, 0px) scale(1);
                      }
                      33% {
                        transform: translate(30px, -50px) scale(1.1);
                      }
                      66% {
                        transform: translate(-20px, 20px) scale(0.9);
                      }
                      100% {
                        transform: translate(0px, 0px) scale(1);
                      }
                    }
                    
                    @keyframes float {
                      0%, 100% {
                        transform: translateY(0px);
                      }
                      50% {
                        transform: translateY(-20px);
                      }
                    }
                    
                    @keyframes float-slow {
                      0%, 100% {
                        transform: translateY(0px) rotate(0deg);
                      }
                      50% {
                        transform: translateY(-15px) rotate(180deg);
                      }
                    }
                    
                    @keyframes spin-slow {
                      from {
                        transform: rotate(0deg);
                      }
                      to {
                        transform: rotate(360deg);
                      }
                    }
                    
                    .animate-blob {
                      animation: blob 7s infinite;
                    }
                    
                    .animation-delay-2000 {
                      animation-delay: 2s;
                    }
                    
                    .animation-delay-4000 {
                      animation-delay: 4s;
                    }
                    
                    .animation-delay-6000 {
                      animation-delay: 6s;
                    }
                    
                    .animate-float {
                      animation: float 6s ease-in-out infinite;
                    }
                    
                    .animate-float-slow {
                      animation: float-slow 8s ease-in-out infinite;
                    }
                    
                    .animate-spin-slow {
                      animation: spin-slow 8s linear infinite;
                    }
                    
                    .bg-grid-pattern {
                      background-image: 
                        linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
                      background-size: 20px 20px;
                    }
                  `}</style>
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
