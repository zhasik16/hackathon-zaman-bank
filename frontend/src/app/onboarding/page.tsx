"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  DollarSign,
  Target,
  TrendingUp,
  Heart,
  Home,
  GraduationCap,
  Plane,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    // Шаг 1: Основная информация
    fullName: "",
    age: "",
    monthlyIncome: "",
    monthlyExpenses: "",

    // Шаг 2: Финансовые цели
    goals: [] as Array<{
      name: string;
      targetAmount: string;
      timeline: string;
      category: string;
    }>,

    // Шаг 3: Финансовые привычки
    riskProfile: "moderate",
    islamicKnowledge: "beginner",
    financialValues: [] as string[],
  });

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Завершаем онбординг и переходим в приложение
      localStorage.setItem("userProfile", JSON.stringify(userData));
      router.push("/chat");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const addGoal = () => {
    setUserData((prev) => ({
      ...prev,
      goals: [
        ...prev.goals,
        { name: "", targetAmount: "", timeline: "", category: "other" },
      ],
    }));
  };

  const updateGoal = (index: number, field: string, value: string) => {
    setUserData((prev) => ({
      ...prev,
      goals: prev.goals.map((goal, i) =>
        i === index ? { ...goal, [field]: value } : goal
      ),
    }));
  };

  // Шаг 1: Основная информация
  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dark text-center">
        Давайте познакомимся!
      </h2>

      <div className="space-y-4">
        <div>
          <label className="form-label text-dark">Ваше имя</label>
          <input
            type="text"
            value={userData.fullName}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, fullName: e.target.value }))
            }
            className="input-field"
            placeholder="Асан Алиев"
          />
        </div>

        <div>
          <label className="form-label text-dark">Возраст</label>
          <input
            type="number"
            value={userData.age}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, age: e.target.value }))
            }
            className="input-field"
            placeholder="28"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label text-dark">
              Ежемесячный доход (₸)
            </label>
            <input
              type="number"
              value={userData.monthlyIncome}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  monthlyIncome: e.target.value,
                }))
              }
              className="input-field"
              placeholder="300000"
            />
          </div>

          <div>
            <label className="form-label text-dark">
              Ежемесячные расходы (₸)
            </label>
            <input
              type="number"
              value={userData.monthlyExpenses}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  monthlyExpenses: e.target.value,
                }))
              }
              className="input-field"
              placeholder="200000"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Шаг 2: Финансовые цели
  // Шаг 2: Финансовые цели
  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white text-center">
        Ваши финансовые цели
      </h2>
      <p className="text-white/80 text-center">Что важно для вас в жизни?</p>

      <div className="space-y-4">
        {userData.goals.map((goal, index) => (
          <div key={index} className="financial-card p-4 relative">
            {" "}
            {/* Добавили relative */}
            {/* 🔥 ДОБАВЛЯЕМ КНОПКУ УДАЛЕНИЯ */}
            <button
              onClick={() => {
                setUserData((prev) => ({
                  ...prev,
                  goals: prev.goals.filter((_, i) => i !== index),
                }));
              }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-all"
              type="button"
            >
              ×
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="form-label">Название цели</label>
                <input
                  type="text"
                  value={goal.name}
                  onChange={(e) => updateGoal(index, "name", e.target.value)}
                  className="input-field"
                  placeholder="Покупка квартиры, Хадж, Образование..."
                />
              </div>

              <div>
                <label className="form-label">Категория</label>
                <select
                  value={goal.category}
                  onChange={(e) =>
                    updateGoal(index, "category", e.target.value)
                  }
                  className="input-field"
                >
                  <option value="housing">Жилье</option>
                  <option value="hajj">Хадж</option>
                  <option value="education">Образование</option>
                  <option value="marriage">Свадьба</option>
                  <option value="business">Бизнес</option>
                  <option value="other">Другое</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Целевая сумма (₸)</label>
                <input
                  type="number"
                  value={goal.targetAmount}
                  onChange={(e) =>
                    updateGoal(index, "targetAmount", e.target.value)
                  }
                  className="input-field"
                  placeholder="5000000"
                />
              </div>

              <div>
                <label className="form-label">Срок (месяцев)</label>
                <input
                  type="number"
                  value={goal.timeline}
                  onChange={(e) =>
                    updateGoal(index, "timeline", e.target.value)
                  }
                  className="input-field"
                  placeholder="60"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addGoal}
          className="w-full btn-secondary flex items-center justify-center gap-2"
        >
          <Target className="h-5 w-5" />
          Добавить цель
        </button>
      </div>
    </div>
  );

  // Шаг 3: Финансовый профиль
  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dark text-center">
        Ваш финансовый профиль
      </h2>

      <div className="space-y-6">
        <div>
          <label className="form-label text-dark">Ваш профиль риска</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            {["conservative", "moderate", "aggressive"].map((profile) => (
              <button
                key={profile}
                type="button"
                onClick={() =>
                  setUserData((prev) => ({ ...prev, riskProfile: profile }))
                }
                className={`p-4 rounded-xl border-2 transition-all ${
                  userData.riskProfile === profile
                    ? "border-blue-500 bg-blue-500/20 text-dark"
                    : "border-gray-300 bg-white/10 text-dark/80 hover:bg-white/20"
                }`}
              >
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                  <span className="font-medium capitalize">
                    {profile === "conservative"
                      ? "Консервативный"
                      : profile === "moderate"
                      ? "Умеренный"
                      : "Агрессивный"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="form-label text-dark">
            Знания исламских финансов
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            {["beginner", "intermediate", "advanced"].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() =>
                  setUserData((prev) => ({ ...prev, islamicKnowledge: level }))
                }
                className={`p-4 rounded-xl border-2 transition-all ${
                  userData.islamicKnowledge === level
                    ? "border-green-500 bg-green-500/20 text-dark"
                    : "border-gray-300 bg-white/10 text-dark  /80 hover:bg-white/20"
                }`}
              >
                <div className="text-center">
                  <Heart className="h-8 w-8 mx-auto mb-2" />
                  <span className="font-medium capitalize">
                    {level === "beginner"
                      ? "Начинающий"
                      : level === "intermediate"
                      ? "Средний"
                      : "Продвинутый"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Шаг 4: Завершение
  const renderStep4 = () => (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-bold text-white">Готово! 🎉</h2>

      <div className="financial-card p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 text-green-600">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6" />
            </div>
            <span className="text-lg font-semibold">Профиль создан</span>
          </div>

          <div className="space-y-2 text-gray-600">
            <p>Теперь вы можете:</p>
            <ul className="space-y-1 text-left">
              <li>• Получать персонализированные финансовые советы</li>
              <li>• Отслеживать прогресс целей</li>
              <li>• Анализировать расходы по принципам ислама</li>
              <li>• Инвестировать в соответствии с шариатом</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const steps = [renderStep1, renderStep2, renderStep3, renderStep4];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Прогресс бар */}
        <div className="glass-effect rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">{step}</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-xl">Zaman Bank</h1>
                <p className="text-white/70 text-sm">Создание профиля</p>
              </div>
            </div>

            <div className="text-white/70">Шаг {step} из 4</div>
          </div>

          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Контент шага */}
        <div className="financial-card p-6 mb-6">{steps[step - 1]()}</div>

        {/* Кнопки навигации */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Назад
          </button>

          <button onClick={handleNext} className="btn-islamic">
            {step === 4 ? "Начать использование" : "Продолжить"}
          </button>
        </div>
      </div>
    </div>
  );
}
