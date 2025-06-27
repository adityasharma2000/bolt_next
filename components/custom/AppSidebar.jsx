import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Button } from "../ui/button";
import { MessageCircleCode } from "lucide-react";
import WorkspaceHistory from "./WorkspaceHistory";
import SideBarFooter from "./SideBarFooter";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import clsx from "clsx";
function AppSidebar() {
  const router = useRouter();
  const { userDetail, setUserDetail } = useContext(UserDetailContext); // Assuming you have a way to get user details from context or props
  const [isHovered, setIsHovered] = useState(false);
  return (
    <>
      <div
        className="fixed top-0 left-0 h-screen w-2 z-50"
        onMouseEnter={() => setIsHovered(true)}
      />
      <Sidebar
        onMouseLeave={() => setIsHovered(false)}
        className={clsx(
          "transition-transform duration-300 z-40",
          isHovered ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Image
          src={"/volt_logo.webp"}
          alt="Logo"
          width={100}
          height={100}
          className="mx-3 mt-[-18px]"
        />
        <Button
          className="mx-5  font-medium text-lg "
          onClick={() => router.push("/")}
        >
          <MessageCircleCode /> Start New Chat
        </Button>
        <SidebarContent className="p-5">
          <SidebarGroup>
            <WorkspaceHistory />
          </SidebarGroup>
          {/* <SidebarGroup /> */}
        </SidebarContent>
        <SidebarFooter>
          <SideBarFooter />
        </SidebarFooter>
        <Button
          variant="ghost"
          className="mx-5 font-normal text-lg mb-3 flex flex-row items-center justify-center"
        >
          <Image
            src={userDetail?.picture}
            alt="propic"
            width={30}
            height={30}
            className=" rounded-full"
          />
          <p>{userDetail?.name} </p>
        </Button>
      </Sidebar>
    </>
  );
}
export default AppSidebar;
