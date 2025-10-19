"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageCircle,
  Target,
  BarChart3,
  Building2,
  Moon,
  Menu,
  X,
  ShoppingBag,
} from "lucide-react";
import { useState, useEffect } from "react";

export function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: "Асан Алиев",
    balance: "1,250,000",
    monthlyIncome: "0",
  });

  const navItems = [
    { href: "/chat", icon: MessageCircle, label: "Ассистент" },
    { href: "/goals", icon: Target, label: "Цели" },
    { href: "/analysis", icon: BarChart3, label: "Анализ" },
    { href: "/products", icon: ShoppingBag, label: "Продукты" }, // Added Products
  ];

  // Загружаем реальные данные пользователя
  useEffect(() => {
    const userProfile = localStorage.getItem("userProfile");
    if (userProfile) {
      try {
        const user = JSON.parse(userProfile);

        // Обновляем имя
        if (user.fullName && user.fullName.trim() !== "") {
          setUserData((prev) => ({ ...prev, name: user.fullName }));
        }

        // Рассчитываем баланс на основе дохода (6 месяцев дохода как пример)
        if (user.monthlyIncome) {
          const income = parseInt(user.monthlyIncome) || 0;
          const balance = (income * 6).toLocaleString("ru-RU"); // 6 месяцев дохода
          setUserData((prev) => ({
            ...prev,
            balance: balance,
            monthlyIncome: user.monthlyIncome,
          }));
        }

        // Если есть текущие накопления из целей, используем их
        if (user.goals && user.goals.length > 0) {
          const totalCurrentAmount = user.goals.reduce(
            (sum: number, goal: any) =>
              sum + (parseInt(goal.currentAmount) || 0),
            0
          );
          if (totalCurrentAmount > 0) {
            setUserData((prev) => ({
              ...prev,
              balance: totalCurrentAmount.toLocaleString("ru-RU"),
            }));
          }
        }
      } catch (error) {
        console.error("Error parsing user profile:", error);
      }
    }
  }, [pathname]); // Обновляем при смене страницы

  return (
    <>
      <nav className="glass-effect rounded-3xl mx-4 mt-4 p-4 fixed top-0 left-0 right-0 z-50 islamic-pattern">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Логотип */}
          <div className="flex items-center space-x-3 arabic-decoration">
            <div className="relative">
              <Moon className="h-8 w-8 text-white" />
              <Building2 className="h-6 w-6 text-white absolute top-1 left-1" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-white font-bold text-xl drop-shadow-lg">
                Zaman Bank
              </h1>
              <p className="text-white/70 text-sm font-light">
                Исламский банкинг
              </p>
            </div>
          </div>

          {/* Десктопная навигация */}
          <div className="hidden md:flex space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item ${
                    isActive ? "nav-item-active" : "nav-item-inactive"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Профиль пользователя с реальными данными */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-right">
              <p className="text-white font-medium drop-shadow-lg">
                {userData.name}
              </p>
              <p className="text-white/80 text-sm font-light">
                Баланс: {userData.balance} ₸
              </p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">
                {userData.name.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Мобильное меню */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Мобильное меню */}
      {isMobileMenuOpen && (
        <div className="fixed top-24 left-4 right-4 z-50 md:hidden">
          <div className="glass-effect rounded-2xl p-4 islamic-pattern">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
