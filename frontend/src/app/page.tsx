"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Проверяем, прошел ли пользователь онбординг
    const userProfile = localStorage.getItem("userProfile");

    if (userProfile) {
      router.push("/chat");
    } else {
      router.push("/onboarding");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-lg">Загрузка...</p>
      </div>
    </div>
  );
}
