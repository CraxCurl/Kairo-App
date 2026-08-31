import { Task, LaptopInfo, TimelineEvent } from '../types';

const API_BASE = '/api';

export const api = {
  async getTasks(): Promise<Task[] | null> {
    try {
      const res = await fetch(`${API_BASE}/tasks`);
      if (!res.ok) return null;
      const data = await res.json();
      if (data.connected && Array.isArray(data.data)) {
        return data.data;
      }
      return null;
    } catch {
      return null;
    }
  },

  async createTask(task: Task): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async reorderTasks(reorderedTasks: Task[]): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reorderedTasks }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async deleteTask(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/tasks?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getLaptopState(): Promise<LaptopInfo | null> {
    try {
      const res = await fetch(`${API_BASE}/laptop`);
      if (!res.ok) return null;
      const data = await res.json();
      if (data.connected && data.data) {
        return data.data;
      }
      return null;
    } catch {
      return null;
    }
  },

  async saveTimelineEvent(event: TimelineEvent): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/timeline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
      return res.ok;
    } catch {
      return false;
    }
  }
};
