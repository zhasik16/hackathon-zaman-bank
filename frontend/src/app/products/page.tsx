"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Building,
  Home,
  Car,
  GraduationCap,
  Heart,
  Users,
  Target,
  Shield,
  TrendingUp,
} from "lucide-react";
import { useUser } from "@/hooks/useUser";

interface BankProduct {
  id: number;
  name: string;
  type: "deposit" | "financing" | "investment" | "savings" | "card";
  description: string;
  features: string[];
  islamic_compliant: boolean;
  risk_level: "low" | "medium" | "high";
  min_amount?: number;
  max_amount?: number;
  timeline?: string;
  recommended_for: string[];
  sharia_principles: string[];
  eligibility: string[];
}

// ACTUAL Zaman Bank products based on their website
const bankProducts: BankProduct[] = [
  {
    id: 1,
    name: "Вклад 'Аманат'",
    type: "deposit",
    description:
      "Исламский беспроцентный вклад с участием в прибыли банка. Соответствует принципам Мудараба.",
    features: [
      "Отсутствие рибы (процентов)",
      "Участие в прибыли банка",
      "Страхование в АСВ",
      "Капитализация доходов",
      "Досрочное снятие возможно",
    ],
    islamic_compliant: true,
    risk_level: "low",
    min_amount: 50000,
    timeline: "3-36 месяцев",
    recommended_for: [
      "Сбережения",
      "Краткосрочные цели",
      "Создание финансовой подушки",
    ],
    sharia_principles: ["Мудараба", "Отсутствие рибы"],
    eligibility: ["Физические лица", "Резиденты РК", "От 18 лет"],
  },
  {
    id: 2,
    name: "Мурабаха финансирование недвижимости",
    type: "financing",
    description:
      "Приобретение жилой недвижимости через механизм перепродажи с согласованной наценкой.",
    features: [
      "Фиксированная стоимость",
      "Прозрачные условия",
      "Рассрочка до 20 лет",
      "Первоначальный взвод от 15%",
      "Страхование объекта",
    ],
    islamic_compliant: true,
    risk_level: "medium",
    min_amount: 5000000,
    max_amount: 50000000,
    timeline: "до 20 лет",
    recommended_for: ["Покупка квартиры", "Приобретение дома", "Ипотека"],
    sharia_principles: ["Мурабаха", "Отсутствие процентов"],
    eligibility: [
      "Физические лица",
      "Постоянный доход",
      "Хорошая кредитная история",
    ],
  },
  {
    id: 3,
    name: "Иджара автомобильное финансирование",
    type: "financing",
    description:
      "Лизинг автомобиля с последующим выкупом по остаточной стоимости. Аренда с правом выкупа.",
    features: [
      "Аренда с выкупом",
      "Низкий первоначальный платеж",
      "Страхование включено",
      "Обслуживание у дилера",
      "Досрочный выкуп",
    ],
    islamic_compliant: true,
    risk_level: "medium",
    min_amount: 3000000,
    timeline: "1-7 лет",
    recommended_for: [
      "Покупка автомобиля",
      "Бизнес-транспорт",
      "Семейный автомобиль",
    ],
    sharia_principles: ["Иджара", "Лизинг с выкупом"],
    eligibility: ["Физические и юридические лица", "Подтверждение дохода"],
  },
  {
    id: 4,
    name: "Инвестиционный счет 'Садака'",
    type: "investment",
    description:
      "Социально ответственные инвестиции в халяльные секторы экономики с экспертным управлением.",
    features: [
      "Диверсификация портфеля",
      "Экспертное управление",
      "Ежеквартальные отчеты",
      "Социальная ответственность",
      "Часть прибыли на благотворительность",
    ],
    islamic_compliant: true,
    risk_level: "medium",
    min_amount: 100000,
    recommended_for: [
      "Долгосрочные инвестиции",
      "Пенсионные накопления",
      "Социальные проекты",
    ],
    sharia_principles: ["Мудараба", "Социальная ответственность"],
    eligibility: ["Резиденты РК", "От 18 лет", "Инвестиционный профиль"],
  },
  {
    id: 5,
    name: "Текущий счет 'Вадиа'",
    type: "savings",
    description:
      "Беспроцентный текущий счет для ежедневных операций с гарантией сохранности средств.",
    features: [
      "Бесплатное обслуживание",
      "Онлайн-банкинг",
      "Мобильное приложение",
      "Бесплатные переводы",
      "Страхование средств",
    ],
    islamic_compliant: true,
    risk_level: "low",
    min_amount: 0,
    recommended_for: [
      "Ежедневные операции",
      "Зарплатные проекты",
      "Управление личными финансами",
    ],
    sharia_principles: ["Вадиа", "Без рибы"],
    eligibility: ["Физические лица", "Резиденты РК", "От 14 лет"],
  },
  {
    id: 6,
    name: "Карта 'Рахмат'",
    type: "card",
    description:
      "Дебетовая карта с кэшбэком и специальными предложениями от партнеров банка.",
    features: [
      "Кэшбэк до 5%",
      "Бесплатное обслуживание",
      "Скидки у партнеров",
      "Мобильные платежи",
      "Страхование покупок",
    ],
    islamic_compliant: true,
    risk_level: "low",
    recommended_for: ["Ежедневные покупки", "Онлайн-шоппинг", "Путешествия"],
    sharia_principles: ["Отсутствие процентов", "Партнерские программы"],
    eligibility: ["Владельцы текущих счетов", "От 18 лет"],
  },
  {
    id: 7,
    name: "Образовательное финансирование",
    type: "financing",
    description:
      "Финансирование образования в вузах РК и за рубежом по исламским принципам.",
    features: [
      "Финансирование до 100% стоимости",
      "Льготный период погашения",
      "Гибкий график платежей",
      "Страхование обучения",
      "Поддержка трудоустройства",
    ],
    islamic_compliant: true,
    risk_level: "medium",
    min_amount: 500000,
    timeline: "до 10 лет",
    recommended_for: [
      "Высшее образование",
      "Магистратура",
      "Профессиональные курсы",
    ],
    sharia_principles: ["Мурабаха", "Социальная поддержка"],
    eligibility: ["Студенты", "Абитуриенты", "При зачислении в вуз"],
  },
  {
    id: 8,
    name: "Медицинское финансирование",
    type: "financing",
    description:
      "Финансирование медицинских услуг, операций и лечения в клиниках Казахстана и за рубежом.",
    features: [
      "Широкий список клиник",
      "Экспресс-одобрение",
      "Страхование лечения",
      "Сопровождение",
      "Гибкие условия",
    ],
    islamic_compliant: true,
    risk_level: "medium",
    min_amount: 300000,
    timeline: "до 5 лет",
    recommended_for: [
      "Плановые операции",
      "Стоматология",
      "Реабилитация",
      "Чекапы",
    ],
    sharia_principles: ["Мурабаха", "Социальная поддержка"],
    eligibility: ["Физические лица", "Медицинские показания"],
  },
];

const productTypes = [
  { value: "all", label: "Все продукты", icon: Building },
  { value: "deposit", label: "Вклады", icon: Shield },
  { value: "financing", label: "Финансирование", icon: TrendingUp },
  { value: "investment", label: "Инвестиции", icon: Users },
  { value: "savings", label: "Счета", icon: Target },
  { value: "card", label: "Карты", icon: Home },
];

const goalCategories = [
  { value: "housing", label: "Жилье", icon: Home },
  { value: "transport", label: "Транспорт", icon: Car },
  { value: "education", label: "Образование", icon: GraduationCap },
  { value: "health", label: "Здоровье", icon: Heart },
  { value: "other", label: "Другое", icon: Target },
];

export default function ProductsPage() {
  const { user, loading } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedGoal, setSelectedGoal] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState<BankProduct[]>([]);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedType, selectedGoal]);

  const filterProducts = () => {
    let filtered = bankProducts;

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.features.some((feature) =>
            feature.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((product) => product.type === selectedType);
    }

    if (selectedGoal !== "all") {
      filtered = filtered.filter((product) =>
        product.recommended_for.some((rec) => {
          const goalMap: Record<string, string[]> = {
            housing: ["квартир", "дом", "недвижимость", "ипотека"],
            transport: ["автомобил", "транспорт"],
            education: ["образовани", "университет", "вуз", "курс"],
            health: ["медицин", "лечени", "операц", "здоровь"],
          };
          return (
            goalMap[selectedGoal]?.some((keyword) =>
              rec.toLowerCase().includes(keyword)
            ) || false
          );
        })
      );
    }

    setSelectedProducts(filtered);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "financing":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "investment":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "savings":
        return "bg-green-100 text-green-800 border-green-200";
      case "card":
        return "bg-pink-100 text-pink-800 border-pink-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRiskText = (risk: string) => {
    switch (risk) {
      case "low":
        return "Низкий риск";
      case "medium":
        return "Средний риск";
      case "high":
        return "Высокий риск";
      default:
        return "Не определен";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-dark text-lg">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Исламские финансовые продукты
          </h1>
          <p className="text-white/80 text-lg">
            Соответствуют принципам шариата и вашим финансовым целям
          </p>
        </div>

        {/* Информация о пользователе */}
        {user && (
          <div className="financial-card p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-dark">
                  Персональный подбор
                </h3>
                <p className="text-dark/70">
                  Подбираем продукты исходя из вашего профиля
                </p>
              </div>
              <div className="text-right">
                <p className="text-dark/70">Профиль риска</p>
                <p className="text-dark font-semibold capitalize">
                  {user.riskProfile || "умеренный"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Фильтры */}
        <div className="financial-card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Поиск */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Поиск продуктов..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Тип продукта */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {productTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            {/* Цель */}
            <select
              value={selectedGoal}
              onChange={(e) => setSelectedGoal(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Все цели</option>
              {goalCategories.map((goal) => (
                <option key={goal.value} value={goal.value}>
                  {goal.label}
                </option>
              ))}
            </select>
          </div>

          {/* Быстрые фильтры */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Тип продукта:
              </p>
              <div className="flex flex-wrap gap-2">
                {productTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setSelectedType(type.value)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all border ${
                        selectedType === type.value
                          ? "bg-blue-600 text-dark border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Для целей:
              </p>
              <div className="flex flex-wrap gap-2">
                {goalCategories.map((goal) => {
                  const Icon = goal.icon;
                  return (
                    <button
                      key={goal.value}
                      onClick={() => setSelectedGoal(goal.value)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all border ${
                        selectedGoal === goal.value
                          ? "bg-green-600 text-dark border-green-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{goal.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Продукты */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedProducts.map((product) => (
            <div
              key={product.id}
              className="financial-card p-6 hover:shadow-lg transition-shadow h-full flex flex-col"
            >
              {/* Заголовок и теги */}
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-dark">
                    {product.name}
                  </h3>
                  {product.islamic_compliant && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full border border-green-200">
                      ✅ Халяль
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(
                      product.type
                    )}`}
                  >
                    {productTypes.find((t) => t.value === product.type)?.label}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(
                      product.risk_level
                    )}`}
                  >
                    {getRiskText(product.risk_level)}
                  </span>
                </div>
              </div>

              {/* Описание */}
              <p className="text-dark/80 mb-4 flex-grow">
                {product.description}
              </p>

              {/* Особенности */}
              <div className="mb-4">
                <h4 className="font-semibold text-dark mb-2">Особенности:</h4>
                <ul className="space-y-1">
                  {product.features.slice(0, 3).map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center text-sm text-dark/70"
                    >
                      <div className="w-1 h-1 bg-blue-500 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Принципы шариата */}
              <div className="mb-4">
                <h4 className="font-semibold text-dark mb-2">
                  Принципы шариата:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {product.sharia_principles.map((principle, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded border border-blue-200"
                    >
                      {principle}
                    </span>
                  ))}
                </div>
              </div>

              {/* Рекомендации */}
              <div className="mb-4">
                <h4 className="font-semibold text-dark mb-2">
                  Рекомендуется для:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {product.recommended_for.map((purpose, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded border border-gray-200"
                    >
                      {purpose}
                    </span>
                  ))}
                </div>
              </div>

              {/* Условия */}
              <div className="mb-4 space-y-1">
                {product.min_amount && (
                  <p className="text-sm text-dark/70">
                    Мин. сумма:{" "}
                    <span className="font-semibold text-dark">
                      {product.min_amount.toLocaleString("ru-RU")} ₸
                    </span>
                  </p>
                )}
                {product.timeline && (
                  <p className="text-sm text-dark/70">
                    Срок:{" "}
                    <span className="font-semibold text-dark">
                      {product.timeline}
                    </span>
                  </p>
                )}
              </div>

              {/* Кнопка действия */}
              <button className="w-full bg-blue-600 text-dark py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold mt-auto">
                Оформить заявку
              </button>
            </div>
          ))}
        </div>

        {/* Если продукты не найдены */}
        {selectedProducts.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-dark mb-2">
              Продукты не найдены
            </h3>
            <p className="text-dark/70">Попробуйте изменить параметры поиска</p>
          </div>
        )}

        {/* Информация о исламских финансах */}
        <div className="financial-card p-6 mt-8">
          <h3 className="text-xl font-bold text-dark mb-4">
            О исламских финансах
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-dark/80">
            <div>
              <h4 className="font-semibold text-dark mb-2">
                Основные принципы:
              </h4>
              <ul className="space-y-1 text-sm">
                <li>• Запрет рибы (процентов)</li>
                <li>• Запрет гарара (неопределенности)</li>
                <li>• Запрет майсира (азартных игр)</li>
                <li>• Социальная ответственность</li>
                <li>• Реальная экономическая деятельность</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-dark mb-2">Преимущества:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Прозрачные условия</li>
                <li>• Справедливое распределение рисков</li>
                <li>• Соответствие этическим нормам</li>
                <li>• Социальная направленность</li>
                <li>• Стабильность и надежность</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
