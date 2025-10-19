"use client";

import { Shield, Users, Home, Car, TrendingUp } from "lucide-react";

interface IslamicProduct {
  name: string;
  type: string;
  description: string;
  profit: string;
  minAmount: number;
  icon: any;
  features: string[];
  shariaCompliant: boolean;
}

export function IslamicProducts() {
  const products: IslamicProduct[] = [
    {
      name: "Мудараба Сберегательный",
      type: "deposit",
      description: "Участие в прибыли банка без фиксированного процента",
      profit: "До 15% годовых",
      minAmount: 50000,
      icon: TrendingUp,
      features: ["Соответствует шариату", "Ежемесячные выплаты", "Без риба"],
      shariaCompliant: true,
    },
    {
      name: "Мурабаха Жилье",
      type: "credit",
      description: "Финансирование покупки недвижимости с наценкой",
      profit: "От 8% годовых",
      minAmount: 1000000,
      icon: Home,
      features: [
        "Рассрочка до 20 лет",
        "Прозрачная наценка",
        "Без скрытых комиссий",
      ],
      shariaCompliant: true,
    },
    {
      name: "Мушарака Бизнес",
      type: "investment",
      description: "Совместное предпринимательство с разделением прибыли",
      profit: "От 20% годовых",
      minAmount: 500000,
      icon: Users,
      features: ["Партнерство", "Разделение рисков", "Активное участие"],
      shariaCompliant: true,
    },
    {
      name: "Иджара Авто",
      type: "leasing",
      description: "Исламский лизинг автомобиля",
      profit: "От 10% годовых",
      minAmount: 300000,
      icon: Car,
      features: ["Страхование включено", "Обслуживание", "Возможность выкупа"],
      shariaCompliant: true,
    },
  ];

  return (
    <div className="financial-card p-6">
      <h3 className="text-xl font-bold mb-4 text-gradient-gold">
        Исламские финансовые продукты
      </h3>
      <p className="text-gray-600 mb-6">
        Подобрано по вашим потребностям и соответствию шариату
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product, index) => {
          const Icon = product.icon;
          return (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-5 hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{product.name}</h4>
                    <p className="text-sm text-gray-600">{product.type}</p>
                  </div>
                </div>
                {product.shariaCompliant && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Соответствует шариату
                  </span>
                )}
              </div>

              <p className="text-gray-700 mb-4">{product.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Доходность:</span>
                  <span className="font-semibold text-green-600">
                    {product.profit}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Минимальная сумма:</span>
                  <span className="font-semibold">
                    {product.minAmount.toLocaleString()} ₸
                  </span>
                </div>
              </div>

              <div className="space-y-1 mb-4">
                {product.features.map((feature, featureIndex) => (
                  <div
                    key={featureIndex}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    {feature}
                  </div>
                ))}
              </div>

              <button className="w-full btn-islamic">Подробнее</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
