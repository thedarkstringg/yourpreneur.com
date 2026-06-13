import { supabase } from './supabaseClient';

export type IntegrationType = 'github' | 'stripe' | 'notion' | 'linear';

export interface Integration {
  id: string;
  userId: string;
  type: IntegrationType;
  config: Record<string, any>;
  lastSyncedAt?: string;
}

// GitHub integration
export const githubIntegration = {
  authenticate: async (code: string) => {
    try {
      // Exchange code for token
      const response = await fetch('/api/integrations/github/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      return await response.json();
    } catch (error) {
      console.error('GitHub auth failed:', error);
      throw error;
    }
  },

  syncRepositories: async (userId: string) => {
    try {
      const response = await fetch('/api/integrations/github/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      return await response.json();
    } catch (error) {
      console.error('GitHub sync failed:', error);
      throw error;
    }
  },
};

// Stripe integration
export const stripeIntegration = {
  authenticate: async (code: string) => {
    try {
      const response = await fetch('/api/integrations/stripe/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      return await response.json();
    } catch (error) {
      console.error('Stripe auth failed:', error);
      throw error;
    }
  },

  syncMetrics: async (userId: string) => {
    try {
      const response = await fetch('/api/integrations/stripe/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      return await response.json();
    } catch (error) {
      console.error('Stripe sync failed:', error);
      throw error;
    }
  },
};

// Notion integration
export const notionIntegration = {
  authenticate: async (code: string) => {
    try {
      const response = await fetch('/api/integrations/notion/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      return await response.json();
    } catch (error) {
      console.error('Notion auth failed:', error);
      throw error;
    }
  },

  syncDatabases: async (userId: string) => {
    try {
      const response = await fetch('/api/integrations/notion/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      return await response.json();
    } catch (error) {
      console.error('Notion sync failed:', error);
      throw error;
    }
  },
};

// Linear integration
export const linearIntegration = {
  authenticate: async (code: string) => {
    try {
      const response = await fetch('/api/integrations/linear/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      return await response.json();
    } catch (error) {
      console.error('Linear auth failed:', error);
      throw error;
    }
  },

  syncIssues: async (userId: string) => {
    try {
      const response = await fetch('/api/integrations/linear/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      return await response.json();
    } catch (error) {
      console.error('Linear sync failed:', error);
      throw error;
    }
  },
};

// Store integration config
export const saveIntegration = async (userId: string, type: IntegrationType, config: Record<string, any>) => {
  try {
    const { data, error } = await supabase
      .from('integrations')
      .upsert([
        {
          user_id: userId,
          type,
          config,
          last_synced_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    return data?.[0];
  } catch (error) {
    console.error('Failed to save integration:', error);
    throw error;
  }
};

// Get user integrations
export const getIntegrations = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('integrations')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to fetch integrations:', error);
    throw error;
  }
};

// Delete integration
export const deleteIntegration = async (id: string) => {
  try {
    const { error } = await supabase
      .from('integrations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Failed to delete integration:', error);
    throw error;
  }
};
