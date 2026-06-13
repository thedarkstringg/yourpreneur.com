import { supabase } from './supabaseClient';

export interface ShareLink {
  id: string;
  userId: string;
  ventureId: string;
  linkToken: string;
  role: 'viewer' | 'editor';
  expiresAt?: string;
  createdAt: string;
}

export interface Invitation {
  id: string;
  ventureId: string;
  email: string;
  role: 'viewer' | 'editor';
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

// Generate a unique share token
const generateShareToken = (): string => {
  return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
};

// Create a share link for a venture
export const createShareLink = async (
  userId: string,
  ventureId: string,
  role: 'viewer' | 'editor' = 'viewer',
  expiresIn?: { days: number }
): Promise<ShareLink> => {
  try {
    const linkToken = generateShareToken();
    let expiresAt = null;

    if (expiresIn) {
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + expiresIn.days);
      expiresAt = expDate.toISOString();
    }

    const { data, error } = await supabase
      .from('share_links')
      .insert([
        {
          user_id: userId,
          venture_id: ventureId,
          link_token: linkToken,
          role,
          expires_at: expiresAt,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      ventureId: data.venture_id,
      linkToken: data.link_token,
      role: data.role,
      expiresAt: data.expires_at,
      createdAt: data.created_at,
    };
  } catch (error) {
    console.error('Failed to create share link:', error);
    throw error;
  }
};

// Get share link by token
export const getShareLinkByToken = async (token: string): Promise<ShareLink | null> => {
  try {
    const { data, error } = await supabase
      .from('share_links')
      .select('*')
      .eq('link_token', token)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    // Check if expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      ventureId: data.venture_id,
      linkToken: data.link_token,
      role: data.role,
      expiresAt: data.expires_at,
      createdAt: data.created_at,
    };
  } catch (error) {
    console.error('Failed to get share link:', error);
    throw error;
  }
};

// List share links for a venture
export const getShareLinksForVenture = async (ventureId: string): Promise<ShareLink[]> => {
  try {
    const { data, error } = await supabase
      .from('share_links')
      .select('*')
      .eq('venture_id', ventureId);

    if (error) throw error;

    return (data || []).map((link) => ({
      id: link.id,
      userId: link.user_id,
      ventureId: link.venture_id,
      linkToken: link.link_token,
      role: link.role,
      expiresAt: link.expires_at,
      createdAt: link.created_at,
    }));
  } catch (error) {
    console.error('Failed to get share links:', error);
    throw error;
  }
};

// Revoke a share link
export const revokeShareLink = async (linkId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('share_links')
      .delete()
      .eq('id', linkId);

    if (error) throw error;
  } catch (error) {
    console.error('Failed to revoke share link:', error);
    throw error;
  }
};

// Send invitation (stub for email integration)
export const sendVentureInvitation = async (
  ventureId: string,
  email: string,
  role: 'viewer' | 'editor' = 'viewer'
): Promise<Invitation> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .insert([
        {
          venture_id: ventureId,
          email,
          role,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // TODO: Send email invitation with invitation link

    return {
      id: data.id,
      ventureId: data.venture_id,
      email: data.email,
      role: data.role,
      status: data.status,
      createdAt: data.created_at,
    };
  } catch (error) {
    console.error('Failed to send invitation:', error);
    throw error;
  }
};

// Accept invitation
export const acceptInvitation = async (invitationId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('invitations')
      .update({ status: 'accepted' })
      .eq('id', invitationId);

    if (error) throw error;
  } catch (error) {
    console.error('Failed to accept invitation:', error);
    throw error;
  }
};

// Get pending invitations for user
export const getPendingInvitations = async (email: string): Promise<Invitation[]> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('email', email)
      .eq('status', 'pending');

    if (error) throw error;

    return (data || []).map((inv) => ({
      id: inv.id,
      ventureId: inv.venture_id,
      email: inv.email,
      role: inv.role,
      status: inv.status,
      createdAt: inv.created_at,
    }));
  } catch (error) {
    console.error('Failed to get invitations:', error);
    throw error;
  }
};
