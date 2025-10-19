"use client";

import { useState } from "react";
import { Map, Home, GraduationCap, Plane, Heart, Car } from "lucide-react";

interface LifeEvent {
  age: number;
  event: string;
  cost: number;
  icon: any;
  color: string;
}

export function LifeGoalsVisualization() {
  const [currentAge, setCurrentAge] = useState(25);

  const lifeEvents: LifeEvent[] = [
    {
      age: 28,
      event: "Покупка квартиры",
      cost: 5000000,
      icon: Home,
      color: "bg-blue-500",
    },
    {
      age: 30,
      event: "Магистратура",
      cost: 2000000,
      icon: GraduationCap,
      color: "bg-green-500",
    },
    {
      age: 32,
      event: "Свадьба",
      cost: 3000000,
      icon: Heart,
      color: "bg-pink-500",
    },
    {
      age: 35,
      event: "Покупка автомобиля",
      cost: 8000000,
      icon: Car,
      color: "bg-purple-500",
    },
    {
      age: 40,
      event: "Хадж",
      cost: 1500000,
      icon: Plane,
      color: "bg-yellow-500",
    },
    {
      age: 45,
      event: "Образование детей",
      cost: 10000000,
      icon: GraduationCap,
      color: "bg-indigo-500",
    },
    {
      age: 60,
      event: "Пенсия",
      cost: 20000000,
      icon: Map,
      color: "bg-gray-500",
    },
  ];

  const futureEvents = lifeEvents.filter((event) => event.age > currentAge);

  return (
    <div className="financial-card p-6">
      <h3 className="text-xl font-bold mb-4 text-gradient">
        Визуализация жизненных целей
      </h3>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ваш текущий возраст: {currentAge} лет
        </label>
        <input
          type="range"
          min="20"
          max="60"
          value={currentAge}
          onChange={(e) => setCurrentAge(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="space-y-4">
        {futureEvents.map((event, index) => {
          const Icon = event.icon;
          const yearsLeft = event.age - currentAge;

          return (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-xl"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${event.color} text-white`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{event.event}</h4>
                  <p className="text-sm text-gray-600">
                    Возраст: {event.age} лет (
                    {yearsLeft > 0 ? `через ${yearsLeft} лет` : "в этом году"})
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-gray-800">
                  {event.cost.toLocaleString()} ₸
                </p>
                <p className="text-sm text-gray-600">
                  {Math.ceil(event.cost / (yearsLeft * 12)).toLocaleString()}{" "}
                  ₸/месяц
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
