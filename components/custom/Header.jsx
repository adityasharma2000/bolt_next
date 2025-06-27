import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { useContext } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { ActionContext } from "@/context/ActionContext";
import { usePathname, useRouter } from "next/navigation";
import { LucideDownload, Rocket } from "lucide-react";
import SignInDialog from "./SignInDialog";
import { useSidebar } from "../ui/sidebar";

function Header() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { action, setAction } = useContext(ActionContext);
  const [openDialog, setOpenDialog] = React.useState(false);
  const path = usePathname();
  const { toggleSidebar } = useSidebar();
  const router = useRouter();

  const onActionBtn = (action) => {
    setAction({ actionType: action, timeStamp: Date.now() });
  };

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <header className="relative py-3 z-20">
      {/* Main Content */}
      <div className="mx-3 flex justify-between items-center cursor-pointer">
        <div 
          className="flex items-center text-2xl font-bold cursor-pointer ml-4 hover:scale-105 transition-transform duration-300"
          onClick={handleLogoClick}
        >
          <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Math</span>
          <span className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">Kraft</span>
        </div>

        {path?.includes("workspace") && (
          <div className="flex gap-2 items-center">
            <Button
              variant="ghost"
              size={"sm"}
              onClick={() => onActionBtn("export")}
              className="bg-white/70 backdrop-blur-sm hover:bg-white/90 border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <LucideDownload />
              Export
            </Button>
            <Button
              size={"sm"}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
              onClick={() => onActionBtn("deploy")}
            >
              <Rocket />
              Deploy
            </Button>
          </div>
        )}
        {userDetail ? (
          <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <Image
              src={userDetail?.picture}
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full ring-2 ring-blue-200"
            />
            <span className="text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
              {userDetail?.name}
            </span>
          </div>
        ) : (
          <div className="flex gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpenDialog(true)}
              className="bg-white/70 backdrop-blur-sm hover:bg-white/90 border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md"
            >
              Sign In
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
              size="sm"
              onClick={() => setOpenDialog(true)}
            >
              Get Started
            </Button>
          </div>
        )}
        <SignInDialog
          openDialog={openDialog}
          closeDialog={(v) => setOpenDialog(v)}
        />
      </div>
    </header>
  );
}

export default Header;
