"use client";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useContext, useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import { useState } from "react";
import Link from "next/link";
import { useSidebar } from "../ui/sidebar";

function WorkspaceHistory() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const convex = useConvex();
  const [workspaceList, setWorkspaceList] = useState([]);
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    userDetail && GetAllWorkspace();
  }, [userDetail]);

  const GetAllWorkspace = async () => {
    try {
      const workspaces = await convex.query(api.workspace.GetAllWorkspaces, {
        userId: userDetail?._id,
      });
      setWorkspaceList(workspaces);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    }
  };

  return (
    <div>
      <h2 className="font-medium text-lg">Your Chat</h2>
      <div>
        {workspaceList?.map((workspace) => (
          <Link href={`/workspace/${workspace._id}`} key={workspace._id}>
            <h2
              onClick={toggleSidebar}
              className="text-sm text-muted-foreground mt-2 font-light hover:text-foreground cursor-pointer"
            >
              {workspace?.messages[0].content}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default WorkspaceHistory;
