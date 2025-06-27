import { HelpCircle, LogOut, Settings, Wallet } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { useContext } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";

function SideBarFooter() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  const SignOut = () => {
    setUserDetail(undefined);
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
  };

  const options = [
    { name: "Settings", icon: Settings },
    { name: "Help Center", icon: HelpCircle },
    { name: "Feedback", icon: Wallet },
    { name: "Logout", icon: LogOut, fun: SignOut },
  ];

  return (
    <div className="ml-2 mb-3 w-full flex flex-col ">
      {options.map((option, index) => (
        <Button
          key={index}
          className="w-full justify-start flex bg-secondary text-secondary-foreground hover:bg-secondary/80"
          onClick={option?.fun}
        >
          <option.icon />
          <p className="text-sm">{option.name}</p>
        </Button>
      ))}
    </div>
  );
}

export default SideBarFooter;
