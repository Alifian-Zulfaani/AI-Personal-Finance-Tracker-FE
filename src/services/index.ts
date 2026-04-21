import api from "./api";
import {
  ApiResponse,
  AuthResponse,
  Transaction,
  TransactionFormData,
  TransactionListResponse,
  TransactionSummary,
  ChatSession,
} from "@/types";

// ─── Auth ────────────────────────────────────────────
export const authService = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<ApiResponse<AuthResponse>>("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<AuthResponse>>("/auth/login", data),

  getProfile: () =>
    api.get<ApiResponse<{ user: AuthResponse["user"] }>>("/auth/profile"),
};

// ─── Transactions ────────────────────────────────────
export const transactionService = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    type?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => api.get<ApiResponse<TransactionListResponse>>("/transactions", { params }),

  getById: (id: string) =>
    api.get<ApiResponse<{ transaction: Transaction }>>(`/transactions/${id}`),

  create: (data: TransactionFormData) =>
    api.post<ApiResponse<{ transaction: Transaction }>>("/transactions", data),

  update: (id: string, data: TransactionFormData) =>
    api.put<ApiResponse<{ transaction: Transaction }>>(`/transactions/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/transactions/${id}`),

  getSummary: (params?: { month?: number; year?: number }) =>
    api.get<ApiResponse<TransactionSummary>>("/transactions/summary", { params }),

  getCategories: () =>
    api.get<ApiResponse<{ categories: string[] }>>("/transactions/categories"),
};

// ─── AI ──────────────────────────────────────────────
export const aiService = {
  categorize: (description: string) =>
    api.post<ApiResponse<{ category: string }>>("/ai/categorize", { description }),

  chat: (message: string, sessionId?: string) =>
    api.post<ApiResponse<{ sessionId: string; message: string }>>("/ai/chat", {
      message,
      sessionId,
    }),

  getChatSessions: () =>
    api.get<ApiResponse<{ sessions: ChatSession[] }>>("/ai/chat/sessions"),

  getChatMessages: (sessionId: string) =>
    api.get<ApiResponse<{ session: ChatSession }>>(`/ai/chat/sessions/${sessionId}`),
};
