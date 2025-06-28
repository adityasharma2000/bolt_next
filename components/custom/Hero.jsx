"use client";
import Lookup from "@/data/Lookup";
import { ArrowRight, Upload, Plus, X } from "lucide-react";
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
  const [isGenerating, setIsGenerating] = useState(false);
  
  // New state for upload and buttons
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [wcagSelected, setWcagSelected] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  
  const CreateWorkspace = useMutation(api.workspace.CreateWorkspace);
  const router = useRouter();

  const grades = Array.from({length: 12}, (_, i) => `Grade ${i + 1}`);
  
  const usStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

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
    }, 4500);
    
    // Complete animation
    const completeTimer = setTimeout(() => {
      setAnimationComplete(true);
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
      setUploadedFile(file);
    } else {
      alert('Please upload a PDF or image file');
    }
  };

  const handleGradeSelect = (grade) => {
    setSelectedGrade(grade);
    setShowGradeModal(false);
  };

  const handleStateSelect = (state) => {
    setSelectedState(state);
    setShowStateModal(false);
  };

  const onGenerate = async (userInput) => {
    if (!userDetail) {
      setOpenDialog(true);
      return;
    }
    
    setIsGenerating(true);
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
      setIsGenerating(false);
    }
  };

  const mathGames = [
    {
      title: "Common Decimals & Fractions",
      description: "Learn Decimal & Fraction Equivalents",
      gameId: "common-decimals-fractions",
      prompt: "Plan an adventure where the player learns about decimal and fraction equivalents."
    },
    {
      title: "Mixed Numbers to Improper",
      description: "Convert Mixed to Improper Fractions",
      gameId: "mixed-number-to-improper-fraction",
      prompt: "Create a learning experience where players convert mixed numbers to improper fractions."
    },
    {
      title: "Division",
      description: "Master Division Skills",
      gameId: "division",
      prompt: "Teach students to divide numbers using penguins and glaciers."
    },
    {
      title: "Improper Fractions as Mixed",
      description: "Write Improper Fractions as Mixed Numbers",
      gameId: "writing-improper-fractions-as-mixed-numbers",
      prompt: "Create a game where players learn to write improper fractions as mixed numbers using Legos."
    },
    {
      title: "Addition Within 20",
      description: "Using Ten Frames",
      gameId: "addition-within-20-using-ten-frames",
      prompt: "Design a game inspired by angry birds where students use slingshots to add numbers within 20."
    },
    {
      title: "2-Digit × 1-Digit",
      description: "Multiplying with Partial Products",
      gameId: "multiplying-2-digits-by-1-digit-with-partial-products",
      prompt: "Generate a game where players learn to multiply 2-digit numbers by 1-digit using partial products."
    }
  ];

  const handleGameClick = (gameId) => {
    window.open(`https://games-dev.quazaredu.com/?game=${gameId}`, '_blank');
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
              disabled={isGenerating}
            />
            {userInput && (
              <div className="relative">
                {isGenerating ? (
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 h-8 w-8 rounded-md flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <ArrowRight
                    onClick={() => onGenerate(userInput)}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 h-8 w-8 rounded-md cursor-pointer text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-110"
                  />
                )}
              </div>
            )}
          </div>
          
          {/* Upload and Selection Buttons Row */}
          <div className="flex gap-3 mt-4 flex-wrap">
            {/* Upload Button */}
            <div className="relative">
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full cursor-pointer transition-colors duration-200 text-sm text-gray-700"
              >
                <Upload size={16} />
                {uploadedFile ? uploadedFile.name.substring(0, 20) + (uploadedFile.name.length > 20 ? '...' : '') : 'Upload PDF/Image'}
              </label>
            </div>

            {/* Grade Selection Button */}
            <button
              onClick={() => setShowGradeModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 text-sm text-gray-700"
            >
              <Plus size={16} />
              {selectedGrade || 'Select a grade'}
            </button>

            {/* State Standards Selection Button */}
            <button
              onClick={() => setShowStateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 text-sm text-gray-700"
            >
              <Plus size={16} />
              {selectedState || 'Select State Standards'}
            </button>

            {/* WCAG Guidelines Button */}
            <button
              onClick={() => setWcagSelected(!wcagSelected)}
              className={`px-4 py-2 rounded-full transition-colors duration-200 text-sm ${
                wcagSelected 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Adhere to WCAG 2.2 guidelines
            </button>
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
                  <h4 className="font-semibold text-sm text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {game.prompt}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Grade Selection Modal */}
      {showGradeModal && (
        <div className="fixed inset-0 bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Select Grade</h3>
              <button
                onClick={() => setShowGradeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {grades.map((grade, index) => (
                <button
                  key={index}
                  onClick={() => handleGradeSelect(grade)}
                  className="p-3 text-center border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200 text-gray-700"
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* State Standards Selection Modal */}
      {showStateModal && (
        <div className="fixed inset-0 bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Select State Standards</h3>
              <button
                onClick={() => setShowStateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {usStates.map((state, index) => (
                <button
                  key={index}
                  onClick={() => handleStateSelect(state)}
                  className="p-3 text-left border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200 text-gray-700"
                >
                  {state}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
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
