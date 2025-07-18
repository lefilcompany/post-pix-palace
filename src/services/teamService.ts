import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Team = Tables<"teams">;
export type TeamMember = Tables<"team_members">;
export type TeamInvitation = Tables<"team_invitations">;
export type Profile = Tables<"profiles">;

export type CreateTeamData = {
  name: string;
  team_code: string;
};

export type CreateInvitationData = {
  team_id: number;
};

class TeamService {
  private async getCurrentUserId(): Promise<string> {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      throw new Error("Usuário não autenticado");
    }
    return user.id;
  }

  // Teams
  async createTeam(teamData: CreateTeamData): Promise<Team> {
    const userId = await this.getCurrentUserId();
    
    const { data, error } = await supabase
      .from("teams")
      .insert({
        name: teamData.name,
        team_code: teamData.team_code,
        admin_user_id: userId,
      })
      .select()
      .single();

    if (error) throw error;

    // Add creator as team member with admin role
    await supabase
      .from("team_members")
      .insert({
        team_id: data.id,
        user_id: userId,
        role: 'admin',
        status: 'active'
      });

    // Update user's current team
    await this.updateUserCurrentTeam(data.id);

    return data;
  }

  async getTeamByCode(teamCode: string): Promise<Team | null> {
    const { data, error } = await supabase
      .from("teams")
      .select(`
        *,
        profiles!teams_admin_user_id_fkey(full_name)
      `)
      .eq("team_code", teamCode)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return data;
  }

  async getUserTeams(): Promise<Team[]> {
    const userId = await this.getCurrentUserId();
    
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .or(`admin_user_id.eq.${userId},id.in.(select team_id from team_members where user_id.eq.${userId} and status.eq.active)`);

    if (error) throw error;
    return data || [];
  }

  // Team Members
  async getTeamMembers(teamId: number): Promise<TeamMember[]> {
    const { data, error } = await supabase
      .from("team_members")
      .select(`
        *,
        profiles(full_name)
      `)
      .eq("team_id", teamId)
      .eq("status", "active");

    if (error) throw error;
    return data || [];
  }

  // Team Invitations
  async createInvitation(invitationData: CreateInvitationData): Promise<TeamInvitation> {
    const userId = await this.getCurrentUserId();
    
    const { data, error } = await supabase
      .from("team_invitations")
      .insert({
        team_id: invitationData.team_id,
        user_id: userId,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getPendingInvitations(teamId?: number): Promise<TeamInvitation[]> {
    const userId = await this.getCurrentUserId();
    
    let query = supabase
      .from("team_invitations")
      .select(`
        *,
        teams(name, admin_user_id),
        profiles(full_name)
      `)
      .eq("status", "pending");

    if (teamId) {
      // Get invitations for a specific team (admin view)
      query = query.eq("team_id", teamId);
    } else {
      // Get user's own invitations
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async approveInvitation(invitationId: number): Promise<void> {
    const { data: invitation, error: invError } = await supabase
      .from("team_invitations")
      .select("*")
      .eq("id", invitationId)
      .single();

    if (invError) throw invError;

    // Add user to team
    await supabase
      .from("team_members")
      .insert({
        team_id: invitation.team_id,
        user_id: invitation.user_id,
        role: 'member',
        status: 'active'
      });

    // Update invitation status
    await supabase
      .from("team_invitations")
      .update({ status: 'approved' })
      .eq("id", invitationId);

    // Update user's current team if they don't have one
    const { data: profile } = await supabase
      .from("profiles")
      .select("current_team_id")
      .eq("id", invitation.user_id)
      .single();

    if (!profile?.current_team_id) {
      await supabase
        .from("profiles")
        .update({ current_team_id: invitation.team_id })
        .eq("id", invitation.user_id);
    }
  }

  async rejectInvitation(invitationId: number): Promise<void> {
    const { error } = await supabase
      .from("team_invitations")
      .update({ status: 'rejected' })
      .eq("id", invitationId);

    if (error) throw error;
  }

  // Profiles
  async getUserProfile(): Promise<Profile | null> {
    const userId = await this.getCurrentUserId();
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  }

  async updateUserProfile(updates: Partial<Profile>): Promise<Profile> {
    const userId = await this.getCurrentUserId();
    
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateUserCurrentTeam(teamId: number): Promise<void> {
    const userId = await this.getCurrentUserId();
    
    const { error } = await supabase
      .from("profiles")
      .update({ current_team_id: teamId })
      .eq("id", userId);

    if (error) throw error;
  }

  // Utility functions
  generateTeamCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  async isUserInTeam(teamId: number): Promise<boolean> {
    const userId = await this.getCurrentUserId();
    
    const { data, error } = await supabase
      .from("team_members")
      .select("id")
      .eq("team_id", teamId)
      .eq("user_id", userId)
      .eq("status", "active")
      .single();

    return !error && !!data;
  }

  async isUserTeamAdmin(teamId: number): Promise<boolean> {
    const userId = await this.getCurrentUserId();
    
    const { data, error } = await supabase
      .from("teams")
      .select("id")
      .eq("id", teamId)
      .eq("admin_user_id", userId)
      .single();

    return !error && !!data;
  }
}

export const teamService = new TeamService();