"use client";
import Lookup from "@/data/Lookup";
import { ArrowRight, Link } from "lucide-react";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import SignInDialog from "./SignInDialog";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
// import { useRouter } from "next/router";
import { useRouter } from "next/navigation";

function Hero() {
  const [userInput, setUserInput] = useState();
  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const CreateWorkspace = useMutation(api.workspace.CreateWorkspace);
  const router = useRouter();

  useEffect(() => {
    // Set mounted to true to prevent hydration issues
    setIsMounted(true);
    
    const user = localStorage.getItem("userDetail");
    if (user) {
      setUserDetail(JSON.parse(user));
    }
    
    // Start showing content after blob animation
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 3500);
    
    // Complete animation
    const completeTimer = setTimeout(() => {
      setAnimationComplete(true);
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, []);

  const onGenerate = async (userInput) => {
    if (!userDetail) {
      setOpenDialog(true);
      return;
    }
    console.log("user hero ", userDetail);
    const msg = { role: "user", content: userInput };
    setMessages(msg);

    console.log("User work: ", userDetail);
    try {
      const workspaceId = await CreateWorkspace({
        user: userDetail._id,
        messages: [msg],
      });
      console.log("Workspace ID", workspaceId);
      router.push(`/workspace/${workspaceId}`);
    } catch (error) {
      console.error("Error creating workspace:", error);
    }
  };

  const mathGames = [
    {
      title: "Addition Within 20",
      description: "Using Ten Frames",
      gameId: "addition-within-20-using-ten-frames"
    },
    {
      title: "Division",
      description: "Master Division Skills",
      gameId: "division"
    },
    {
      title: "Equivalent Fractions",
      description: "Learn Equal Fractions",
      gameId: "equivalent-fractions"
    },
    {
      title: "Mixed Numbers",
      description: "Write as Improper Fractions",
      gameId: "writing-mixed-numbers-as-improper-fractions"
    },
    {
      title: "Multiplication",
      description: "With & Without Regrouping",
      gameId: "multiplying-with-and-without-regrouping"
    },
    {
      title: "Add Fractions",
      description: "Common Denominator",
      gameId: "add-fractions-with-common-denominator"
    }
  ];

  const handleGameClick = (gameId) => {
    window.open(`https://super-artifacts.vercel.app/?game=${gameId}`, '_blank');
  };

  // Only render animations after component is mounted to prevent hydration errors
  if (!isMounted) {
    return (
      <div className="relative flex flex-col items-center pt-9 xl:pt-12 gap-2 min-h-screen">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-96 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-64 mx-auto mb-8"></div>
          <div className="h-32 bg-gray-200 rounded-xl w-full max-w-4xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center pt-9 xl:pt-12 gap-2 min-h-screen overflow-hidden">
      {/* Blob Animation Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Animated Blobs */}
          <div className={`absolute w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl transition-opacity duration-1000 ${animationComplete ? 'opacity-20' : 'opacity-70'} animate-blob-1`}></div>
          <div className={`absolute w-72 h-72 bg-gradient-to-r from-yellow-400 to-red-400 rounded-full mix-blend-multiply filter blur-xl transition-opacity duration-1000 ${animationComplete ? 'opacity-20' : 'opacity-70'} animate-blob-2`}></div>
          <div className={`absolute w-72 h-72 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl transition-opacity duration-1000 ${animationComplete ? 'opacity-20' : 'opacity-70'} animate-blob-3`}></div>
          <div className={`absolute w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl transition-opacity duration-1000 ${animationComplete ? 'opacity-20' : 'opacity-70'} animate-blob-4`}></div>
          <div className={`absolute w-72 h-72 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full mix-blend-multiply filter blur-xl transition-opacity duration-1000 ${animationComplete ? 'opacity-20' : 'opacity-70'} animate-blob-5`}></div>
          <div className={`absolute w-72 h-72 bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-xl transition-opacity duration-1000 ${animationComplete ? 'opacity-20' : 'opacity-70'} animate-blob-6`}></div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`relative z-20 flex flex-col items-center w-full transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h2 className="font-bold text-4xl text-center bg-gradient-to-r from-blue-800 to-purple-800 bg-clip-text text-transparent">
          {Lookup.HERO_HEADING}
        </h2>
        <p className="text-gray-600 font-medium text-center mt-2">{Lookup.HERO_DESC}</p>

        <div className="p-5 border border-gray-200 rounded-xl max-w-4xl w-full mt-6 bg-white/80 backdrop-blur-sm shadow-xl">
          <div className="flex gap-2">
            <textarea
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={Lookup.INPUT_PLACEHOLDER}
              className="outline-none bg-transparent w-full h-32 max-h-56 resize-none text-gray-800"
            />
            {userInput && (
              <ArrowRight
                onClick={() => onGenerate(userInput)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 h-8 w-8 rounded-md cursor-pointer text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-110"
              />
            )}
          </div>
          <div>
            <Link />
          </div>
        </div>
        
        <div className="mt-12 max-w-6xl w-full pb-20">
          <h3 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-800 to-purple-800 bg-clip-text text-transparent">
            Explore Math Learning Games
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mathGames.map((game, index) => (
              <div
                key={index}
                onClick={() => handleGameClick(game.gameId)}
                className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-blue-300 group"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={`/images/games/${game.gameId}.png`}
                    alt={game.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="px-6 pt-3 pb-2">
                  <h4 className="font-semibold text-lg text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {game.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <SignInDialog
        openDialog={openDialog}
        closeDialog={(v) => setOpenDialog(v)}
      />

      <style jsx>{`
        @keyframes blob-1 {
          0% { transform: translate(-100px, -100px) scale(1); }
          25% { transform: translate(-50px, -150px) scale(1.1); }
          50% { transform: translate(0px, 0px) scale(1.2); }
          70% { transform: translate(0px, 0px) scale(1.2); }
          100% { transform: translate(-300px, -200px) scale(0.8); }
        }
        
        @keyframes blob-2 {
          0% { transform: translate(100px, 100px) scale(1); }
          25% { transform: translate(150px, 50px) scale(1.1); }
          50% { transform: translate(0px, 0px) scale(1.2); }
          70% { transform: translate(0px, 0px) scale(1.2); }
          100% { transform: translate(400px, 300px) scale(0.8); }
        }
        
        @keyframes blob-3 {
          0% { transform: translate(-150px, 50px) scale(1); }
          25% { transform: translate(-100px, -50px) scale(1.1); }
          50% { transform: translate(0px, 0px) scale(1.2); }
          70% { transform: translate(0px, 0px) scale(1.2); }
          100% { transform: translate(-400px, 250px) scale(0.8); }
        }
        
        @keyframes blob-4 {
          0% { transform: translate(150px, -100px) scale(1); }
          25% { transform: translate(100px, 100px) scale(1.1); }
          50% { transform: translate(0px, 0px) scale(1.2); }
          70% { transform: translate(0px, 0px) scale(1.2); }
          100% { transform: translate(350px, -250px) scale(0.8); }
        }
        
        @keyframes blob-5 {
          0% { transform: translate(-50px, -150px) scale(1); }
          25% { transform: translate(100px, -100px) scale(1.1); }
          50% { transform: translate(0px, 0px) scale(1.2); }
          70% { transform: translate(0px, 0px) scale(1.2); }
          100% { transform: translate(-250px, 300px) scale(0.8); }
        }
        
        @keyframes blob-6 {
          0% { transform: translate(50px, 150px) scale(1); }
          25% { transform: translate(-100px, 100px) scale(1.1); }
          50% { transform: translate(0px, 0px) scale(1.2); }
          70% { transform: translate(0px, 0px) scale(1.2); }
          100% { transform: translate(300px, 200px) scale(0.8); }
        }
        
        .animate-blob-1 { animation: blob-1 5s ease-in-out forwards; }
        .animate-blob-2 { animation: blob-2 5s ease-in-out 0.2s forwards; }
        .animate-blob-3 { animation: blob-3 5s ease-in-out 0.4s forwards; }
        .animate-blob-4 { animation: blob-4 5s ease-in-out 0.6s forwards; }
        .animate-blob-5 { animation: blob-5 5s ease-in-out 0.8s forwards; }
        .animate-blob-6 { animation: blob-6 5s ease-in-out 1s forwards; }
      `}</style>
    </div>
  );
}

export default Hero;
