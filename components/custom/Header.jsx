import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { useContext } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { ActionContext } from "@/context/ActionContext";
import { usePathname } from "next/navigation";
import { LucideDownload, Rocket } from "lucide-react";
import SignInDialog from "./SignInDialog";
import { useSidebar } from "../ui/sidebar";
function Header() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { action, setAction } = useContext(ActionContext);
  const [openDialog, setOpenDialog] = React.useState(false);
  const path = usePathname();
  const { toggleSidebar } = useSidebar();

  const onActionBtn = (action) => {
    setAction({ actionType: action, timeStamp: Date.now() });
  };

  return (
    <header className=" ">
      <div className="mx-3 flex justify-between items-center mt-[-18px] cursor-pointer">
        <Image
          src={"/volt_logo.webp"}
          alt="Volt Logo"
          width={100}
          height={100}
          onClick={toggleSidebar}
        />

        {path?.includes("workspace") && (
          <div className="flex gap-2 items-center">
            <Button
              variant="ghost"
              size={"sm"}
              onClick={() => onActionBtn("export")}
            >
              <LucideDownload />
              Export
            </Button>
            <Button
              size={"sm"}
              className="text-white bg-blue-500 hover:bg-blue-600"
              onClick={() => onActionBtn("deploy")}
            >
              <Rocket />
              Deploy
            </Button>
          </div>
        )}
        {userDetail ? (
          <></>
        ) : (
          <div className="flex gap-4  ">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpenDialog(true)}
            >
              Sign In
            </Button>
            <Button
              className="text-white bg-blue-500"
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
