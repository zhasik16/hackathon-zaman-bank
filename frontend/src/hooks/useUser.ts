import { useState, useEffect } from 'react';

export interface UserProfile {
  fullName: string;
  age: string;
  monthlyIncome: string;
  monthlyExpenses: string;
  goals: Array<{
    name: string;
    targetAmount: string;
    timeline: string;
    category: string;
  }>;
  riskProfile: string;
  islamicKnowledge: string;
  financialValues: string[];
}

export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('userProfile');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const updateUser = (newUserData: Partial<UserProfile>) => {
    const updatedUser = { ...user, ...newUserData } as UserProfile;
    setUser(updatedUser);
    localStorage.setItem('userProfile', JSON.stringify(updatedUser));
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem('userProfile');
  };

  return { user, loading, updateUser, clearUser };
}