import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lessonsData } from '@/constants/lessonsData';
import { achievementsData } from '@/constants/achievementsData';

// ─── Types ───────────────────────────────────────────────────

export type Role = 'parent' | 'child' | null;

export interface User {
  id: string;
  name: string;
  pin: string;
  role: Role;
  avatar: string;
  age?: number;
}

export interface Loan {
  id: string;
  childId: string;
  amount: number;
  interestRate: number;
  totalDue: number;
  paidAmount: number;
  createdAt: string;
  dueDate: string;
  status: 'active' | 'paid' | 'overdue';
}

export interface LoanRequest {
  id: string;
  childId: string;
  amount: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  respondedAt?: string;
}

export interface Task {
  id: string;
  childId: string;
  title: string;
  description: string;
  reward: number;
  status: 'pending' | 'completed' | 'approved';
  createdAt: string;
  completedAt?: string;
}

export interface UnlockedAchievement {
  id: string;
  unlockedAt: string;
}

export interface Child {
  id: string;
  name: string;
  age: number;
  avatar: string;
  balance: number;
  savings: number;
  loans: Loan[];
  loanRequests: LoanRequest[];
  tasks: Task[];
  achievements: UnlockedAchievement[];
  lessonsCompleted: string[];
  streak: number;
  lastActiveDate: string;
  creditScore: number;
}

type AgeGroup = 'junior' | 'teen' | 'senior';

const getAgeGroup = (age: number): AgeGroup => {
  if (age <= 9) return 'junior';
  if (age <= 14) return 'teen';
  return 'senior';
};

export interface AppState {
  currentUser: User | null;
  currentRole: Role;
  selectedChildId: string | null;
  users: User[];
  children: Child[];
  isLoaded: boolean;
}

// ─── Actions ─────────────────────────────────────────────────

type Action =
  | { type: 'LOGIN'; user: User }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER'; name: string; pin: string; role: Role; avatar: string; age?: number }
  | { type: 'SET_ROLE'; role: Role }
  | { type: 'SELECT_CHILD'; childId: string }
  | { type: 'ADD_CHILD'; name: string; avatar: string; age: number }
  | { type: 'DEPOSIT'; childId: string; amount: number }
  | { type: 'WITHDRAW'; childId: string; amount: number }
  | { type: 'ADD_TO_SAVINGS'; childId: string; amount: number }
  | { type: 'WITHDRAW_FROM_SAVINGS'; childId: string; amount: number }
  | { type: 'CREATE_LOAN'; childId: string; amount: number; interestRate: number; dueDate: string }
  | { type: 'REPAY_LOAN'; childId: string; loanId: string; amount: number }
  | { type: 'REQUEST_LOAN'; childId: string; amount: number; purpose: string }
  | { type: 'APPROVE_LOAN_REQUEST'; childId: string; requestId: string; interestRate: number; dueDays: number }
  | { type: 'REJECT_LOAN_REQUEST'; childId: string; requestId: string }
  | { type: 'CREATE_TASK'; childId: string; title: string; description: string; reward: number }
  | { type: 'COMPLETE_TASK'; childId: string; taskId: string }
  | { type: 'APPROVE_TASK'; childId: string; taskId: string }
  | { type: 'COMPLETE_LESSON'; childId: string; lessonId: string }
  | { type: 'UNLOCK_ACHIEVEMENT'; childId: string; achievementId: string }
  | { type: 'UPDATE_STREAK'; childId: string }
  | { type: 'LOAD_STATE'; state: AppState }
  | { type: 'RESET' };

// ─── Helpers ─────────────────────────────────────────────────

const generateId = () => Math.random().toString(36).substring(2, 11);

const calculateCreditScore = (child: Child): number => {
  const totalLoans = child.loans.length;
  if (totalLoans === 0) return 3;
  const paidLoans = child.loans.filter(l => l.status === 'paid').length;
  const overdueLoans = child.loans.filter(l => l.status === 'overdue').length;
  let score = 3;
  score += (paidLoans / totalLoans) * 2;
  score -= (overdueLoans / totalLoans) * 2;
  return Math.max(1, Math.min(5, Math.round(score)));
};

const updateChildInList = (
  children: Child[],
  childId: string,
  updater: (child: Child) => Child
): Child[] => children.map(c => (c.id === childId ? updater(c) : c));

// ─── Reducer ─────────────────────────────────────────────────

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, currentUser: action.user, currentRole: action.user.role };

    case 'LOGOUT':
      return { ...state, currentUser: null, currentRole: null, selectedChildId: null };

    case 'REGISTER': {
      const newUser: User = {
        id: generateId(),
        name: action.name,
        pin: action.pin,
        role: action.role,
        avatar: action.avatar,
        age: action.age,
      };
      // If registering as child, also create a Child entry
      let newChildren = state.children;
      if (action.role === 'child') {
        const newChild: Child = {
          id: newUser.id,
          name: action.name,
          age: action.age || 10,
          avatar: action.avatar,
          balance: 0,
          savings: 0,
          loans: [],
          loanRequests: [],
          tasks: [],
          achievements: [],
          lessonsCompleted: [],
          streak: 0,
          lastActiveDate: new Date().toISOString(),
          creditScore: 3,
        };
        newChildren = [...state.children, newChild];
      }
      return {
        ...state,
        users: [...state.users, newUser],
        children: newChildren,
        currentUser: newUser,
        currentRole: action.role,
      };
    }

    case 'SET_ROLE':
      return { ...state, currentRole: action.role };

    case 'SELECT_CHILD':
      return { ...state, selectedChildId: action.childId };

    case 'ADD_CHILD': {
      const childId = generateId();
      const newChild: Child = {
        id: childId,
        name: action.name,
        age: action.age,
        avatar: action.avatar,
        balance: 0,
        savings: 0,
        loans: [],
        loanRequests: [],
        tasks: [],
        achievements: [],
        lessonsCompleted: [],
        streak: 0,
        lastActiveDate: new Date().toISOString(),
        creditScore: 3,
      };
      const newUser: User = {
        id: childId,
        name: action.name,
        pin: '1234',
        role: 'child',
        avatar: action.avatar,
        age: action.age,
      };
      return {
        ...state,
        children: [...state.children, newChild],
        users: [...state.users, newUser],
      };
    }

    case 'DEPOSIT': {
      return {
        ...state,
        children: updateChildInList(state.children, action.childId, child => ({
          ...child,
          balance: child.balance + action.amount,
        })),
      };
    }

    case 'WITHDRAW': {
      return {
        ...state,
        children: updateChildInList(state.children, action.childId, child => ({
          ...child,
          balance: Math.max(0, child.balance - action.amount),
        })),
      };
    }

    case 'ADD_TO_SAVINGS': {
      return {
        ...state,
        children: updateChildInList(state.children, action.childId, child => ({
          ...child,
          balance: Math.max(0, child.balance - action.amount),
          savings: child.savings + action.amount,
        })),
      };
    }

    case 'WITHDRAW_FROM_SAVINGS': {
      return {
        ...state,
        children: updateChildInList(state.children, action.childId, child => ({
          ...child,
          balance: child.balance + action.amount,
          savings: Math.max(0, child.savings - action.amount),
        })),
      };
    }

    case 'CREATE_LOAN': {
      const interest = action.amount * (action.interestRate / 100);
      const newLoan: Loan = {
        id: generateId(),
        childId: action.childId,
        amount: action.amount,
        interestRate: action.interestRate,
        totalDue: action.amount + interest,
        paidAmount: 0,
        createdAt: new Date().toISOString(),
        dueDate: action.dueDate,
        status: 'active',
      };
      return {
        ...state,
        children: updateChildInList(state.children, action.childId, child => {
          const updated = {
            ...child,
            balance: child.balance + action.amount,
            loans: [...child.loans, newLoan],
          };
          return { ...updated, creditScore: calculateCreditScore(updated) };
        }),
      };
    }

    case 'REQUEST_LOAN': {
      const newRequest: LoanRequest = {
        id: generateId(),
        childId: action.childId,
        amount: action.amount,
        purpose: action.purpose,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      return {
        ...state,
        children: updateChildInList(state.children, action.childId, child => ({
          ...child,
          loanRequests: [...child.loanRequests, newRequest],
        })),
      };
    }

    case 'APPROVE_LOAN_REQUEST': {
      return {
        ...state,
        children: updateChildInList(state.children, action.childId, child => {
          const request = child.loanRequests.find(r => r.id === action.requestId);
          if (!request) return child;
          const interest = request.amount * (action.interestRate / 100);
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + action.dueDays);
          const newLoan: Loan = {
            id: generateId(),
            childId: action.childId,
            amount: request.amount,
            interestRate: action.interestRate,
            totalDue: request.amount + interest,
            paidAmount: 0,
            createdAt: new Date().toISOString(),
            dueDate: dueDate.toISOString(),
            status: 'active',
          };
          const updated = {
            ...child,
            balance: child.balance + request.amount,
            loans: [...child.loans, newLoan],
            loanRequests: child.loanRequests.map(r =>
              r.id === action.requestId
                ? { ...r, status: 'approved' as const, respondedAt: new Date().toISOString() }
                : r
            ),
          };
          return { ...updated, creditScore: calculateCreditScore(updated) };
        }),
      };
    }

    case 'REJECT_LOAN_REQUEST': {
      return {
        ...state,
        children: updateChildInList(state.children, action.childId, child => ({
          ...child,
          loanRequests: child.loanRequests.map(r =>
            r.id === action.requestId
              ? { ...r, status: 'rejected' as const, respondedAt: new Date().toISOString() }
              : r
          ),
        })),
      };
    }

    case 'REPAY_LOAN': {
      return {
        ...state,
        children: updateChildInList(state.children, action.childId, child => {
          const updatedLoans = child.loans.map(loan => {
            if (loan.id !== action.loanId) return loan;
            const newPaid = loan.paidAmount + action.amount;
            const isPaid = newPaid >= loan.totalDue;
            return {
              ...loan,
              paidAmount: Math.min(newPaid, loan.totalDue),
              status: isPaid ? ('paid' as const) : loan.status,
            };
          });
          const updated = {
            ...child,
            balance: Math.max(0, child.balance - action.amount),
            loans: updatedLoans,
          };
          return { ...updated, creditScore: calculateCreditScore(updated) };
        }),
      };
    }

    case 'CREATE_TASK': {
      const newTask: Task = {
        id: generateId(),
        childId: action.childId,
        title: action.title,
        description: action.description,
        reward: action.reward,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      return {
        ...state,
        children: updateChildInList(state.children, action.childId, child => ({
          ...child,
          tasks: [...child.tasks, newTask],
        })),
      };
    }

    case 'COMPLETE_TASK':
      return {
        ...state,
        children: updateChildInList(state.children, action.childId, child => ({
          ...child,
          tasks: child.tasks.map(t =>
            t.id === action.taskId
              ? { ...t, status: 'completed' as const, completedAt: new Date().toISOString() }
              : t
          ),
        })),
      };

    case 'APPROVE_TASK':
      return {
        ...state,
        children: updateChildInList(state.children, action.childId, child => {
          const task = child.tasks.find(t => t.id === action.taskId);
          if (!task) return child;
          const isJunior = getAgeGroup(child.age) === 'junior';
          return {
            ...child,
            balance: isJunior ? child.balance : child.balance + task.reward,
            savings: isJunior ? child.savings + task.reward : child.savings,
            tasks: child.tasks.map(t =>
              t.id === action.taskId ? { ...t, status: 'approved' as const } : t
            ),
          };
        }),
      };

    case 'COMPLETE_LESSON':
      return {
        ...state,
        children: updateChildInList(state.children, action.childId, child => ({
          ...child,
          lessonsCompleted: child.lessonsCompleted.includes(action.lessonId)
            ? child.lessonsCompleted
            : [...child.lessonsCompleted, action.lessonId],
        })),
      };

    case 'UNLOCK_ACHIEVEMENT':
      return {
        ...state,
        children: updateChildInList(state.children, action.childId, child => ({
          ...child,
          achievements: child.achievements.some(a => a.id === action.achievementId)
            ? child.achievements
            : [...child.achievements, { id: action.achievementId, unlockedAt: new Date().toISOString() }],
        })),
      };

    case 'UPDATE_STREAK':
      return {
        ...state,
        children: updateChildInList(state.children, action.childId, child => {
          const today = new Date().toDateString();
          const lastActive = new Date(child.lastActiveDate).toDateString();
          const yesterday = new Date(Date.now() - 86400000).toDateString();
          let newStreak = child.streak;
          if (lastActive === yesterday) newStreak += 1;
          else if (lastActive !== today) newStreak = 1;
          return { ...child, streak: newStreak, lastActiveDate: new Date().toISOString() };
        }),
      };

    case 'LOAD_STATE':
      return { ...action.state, isLoaded: true };

    case 'RESET':
      return { ...initialState, isLoaded: true };

    default:
      return state;
  }
}

// ─── Initial State ───────────────────────────────────────────

const initialState: AppState = {
  currentUser: null,
  currentRole: null,
  selectedChildId: null,
  users: [
    { id: 'parent-1', name: 'Ээж', pin: '0000', role: 'parent', avatar: 'shield' },
    { id: 'child-1', name: 'Болд', pin: '0000', role: 'child', avatar: 'rocket', age: 12 },
    { id: 'child-2', name: 'Сарнай', pin: '0000', role: 'child', avatar: 'star', age: 8 },
    { id: 'child-3', name: 'Бат', pin: '0000', role: 'child', avatar: 'star', age:17 },
  ],
  children: [
    {
      id: 'child-1',
      name: 'Болд',
      age: 12,
      avatar: 'rocket',
      balance: 0,
      savings: 0,
      loans: [],
      loanRequests: [],
      tasks: [],
      achievements: [],
      lessonsCompleted: [],
      streak: 0,
      lastActiveDate: new Date().toISOString(),
      creditScore: 3,
    },
    {
      id: 'child-2',
      name: 'Сарнай',
      age: 8,
      avatar: 'star',
      balance: 0,
      savings: 0,
      loans: [],
      loanRequests: [],
      tasks: [],
      achievements: [],
      lessonsCompleted: [],
      streak: 0,
      lastActiveDate: new Date().toISOString(),
      creditScore: 3,
    },
    {
      id: 'child-3',
      name: 'Бат',
      age: 17,
      avatar: 'star',
      balance: 0,
      savings: 0,
      loans: [],
      loanRequests: [],
      tasks: [],
      achievements: [],
      lessonsCompleted: [],
      streak: 0,
      lastActiveDate: new Date().toISOString(),
      creditScore: 3,
    },
  ],
  isLoaded: false,
};

// ─── Context ─────────────────────────────────────────────────

const STORAGE_KEY = '@moneymii_state_v2';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  getChild: (childId: string) => Child | undefined;
  getSelectedChild: () => Child | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Save only when loaded
    if (state.isLoaded) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(err => {
        console.error('AsyncStorage error:', err);
      });
    }
  }, [state]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(raw => {
        if (raw) {
          const parsed = JSON.parse(raw) as AppState;
          dispatch({ type: 'LOAD_STATE', state: parsed });
        } else {
          // Marking as loaded even if no saved state exists
          dispatch({ type: 'LOAD_STATE', state: initialState });
        }
      })
      .catch(err => {
        console.error('Failed to load state:', err);
        // Fallback to initial state if load fails
        dispatch({ type: 'LOAD_STATE', state: initialState });
      });
  }, []);

  const getChild = (childId: string) => state.children.find(c => c.id === childId);
  const getSelectedChild = () =>
    state.selectedChildId ? getChild(state.selectedChildId) : state.children[0];

  return (
    <AppContext.Provider value={{ state, dispatch, getChild, getSelectedChild }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}

export { lessonsData, achievementsData, getAgeGroup };
export type { AgeGroup };
