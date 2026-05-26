import { Button } from "@/components/ui/button";
import {
  Show,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import { ChartColumnBigIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-100 h-[calc(100vh-80px)] flex items-center justify-center bg-white relative">
      <Image
        alt="Cover image"
        src="/cover.webp"
        fill
        className="object-cover opacity-50"
      />
      <div className="relative z-10 text-center flex flex-col gap-4">
        <h1 className="text-5xl font-bold flex gap-1 items-center justify-center">
          <ChartColumnBigIcon className="text-lime-500" size={60} /> NextCash
        </h1>
        <p className="text-2xl">Track your finances with ease</p>
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
          <Link href="/dashboard">
            <Button variant="default">Go to Dashboard</Button>
          </Link>
        </Show>
      </div>
    </main>
  );
}
