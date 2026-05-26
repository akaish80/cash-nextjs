import { ChartColumnBigIcon } from "lucide-react";
import Link from "next/link";
import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import UserDropdown from "@/app/user-dropdown";

export const Navigation = () => {
  return (
    <nav className="bg-primary p-4 text-white h-20 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-1 font-bold text-2xl">
        <ChartColumnBigIcon className="text-lime-500" />
        Next Cash
      </Link>
      <div className="flex items-center gap-4">
        <Show when="signed-out">
          <SignInButton>
            <Button variant="link" className="text-white">
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton>
            <Button variant="link" className="text-white">
              Sign Up
            </Button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <UserDropdown />
        </Show>
      </div>
    </nav>
  );
};
