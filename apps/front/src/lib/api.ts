const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Company {
  id: string;
  userId: string;
  name: string;
  sector: string;
  targetRaise: number;
  revenue: number;
  kycVerified: boolean;
  financialsLinked: boolean;
  createdAt: string;
}

export interface Document {
  id: string;
  userId: string;
  companyId: string;
  name: string;
  mimeType: string;
  size: number;
  path: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  message: string;
  createdAt: string;
  readAt?: string;
}

export interface ScoreResponse {
  score: number;
  reasons: string[];
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Company endpoints
  async createCompany(data: {
    name: string;
    sector: string;
    targetRaise: number;
    revenue: number;
  }): Promise<Company> {
    return this.request("/api/company", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getCompany(): Promise<Company | null> {
    try {
      return await this.request("/api/company");
    } catch {
      return null;
    }
  }

  // KYC endpoints
  async verifyKYC(): Promise<{ verified: boolean }> {
    return this.request("/api/kyc/verify", {
      method: "POST",
      body: JSON.stringify({}),
    });
  }

  // Financials endpoints
  async linkFinancials(token: string): Promise<{ success: boolean }> {
    return this.request("/api/financials/link", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  }

  // Files endpoints
  async uploadFile(file: File): Promise<Document> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/api/files`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`File upload failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getFiles(): Promise<Document[]> {
    return this.request("/api/files");
  }

  // Score endpoint
  async getScore(): Promise<ScoreResponse> {
    return this.request("/api/score");
  }

  // Notifications endpoint
  async getNotifications(): Promise<Notification[]> {
    return this.request("/api/notifications");
  }

  async markNotificationRead(id: string): Promise<void> {
    return this.request(`/api/notifications/${id}/read`, {
      method: "POST",
    });
  }

  // Cap table endpoint
  async getCapTable(): Promise<any> {
    return this.request("/api/carta/cap-table");
  }
}

export const apiClient = new ApiClient();
