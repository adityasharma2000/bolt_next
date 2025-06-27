import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import { UserDetailContext } from "@/context/UserDetailContext";
import axios from "axios";
import { useContext } from "react";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import uuid4 from "uuid4";
import Image from "next/image";

export default function SignInDialog({ openDialog, closeDialog }) {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const CreateUser = useMutation(api.users.CreateUser);
  const convex = useConvex();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokenResponse?.access_token}`,
          },
        }
      );
      console.log(userInfo.data);
      const { name, email, picture } = userInfo.data;
      await CreateUser({
        name,
        email,
        picture,
        uid: uuid4(),
      });

      //setuser at local storage
      if (typeof window !== "undefined") {
        // in string or without
        localStorage.setItem("user", JSON.stringify(userInfo.data));
      }
      console.log("User signiin", userInfo.data);
      closeDialog(false);
      const result = await convex.query(api.users.GetUser, {
        email: email,
      });
      setUserDetail(result);
    },
  });

  return (
    <Dialog
      open={openDialog}
      onOpenChange={closeDialog}
      className="" //not working
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="w-50 h-40 mx-auto">
            <img src="./mathkraft_logo.svg" alt="MathKraft Logo" className="mx-auto" width="120" height="40" />
          </DialogTitle>
          <DialogDescription className="text-center text-[15px] font-medium m-8 mx-12">
            To use MathKraft you must log into an existing account or create one
            using one of the options below
          </DialogDescription>
          <DialogDescription className="flex flex-col gap-4">
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 mx-10"
              size="lg"
              onClick={() => login()}
            >
              <Image
                src={"/icons8-google.png"}
                alt="google"
                width={25}
                height={25}
              />{" "}
              Sign in with Google
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 mx-10"
              size="lg"
            >
              <Image
                src={"/icons8-google.png"}
                alt="github"
                width={20}
                height={20}
              />{" "}
              Sign in with GitHub
            </Button>
            <Button variant="ghost" className="mx-10" size="lg">
              Sign In with Email and Password
            </Button>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="text-center text-[15px] font-medium my-8 mx-12">
          By using MathKraft, you agree to the collection of usage data for analytics.
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
