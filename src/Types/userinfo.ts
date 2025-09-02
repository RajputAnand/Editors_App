export interface UserData {
  code: number;
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
    user_name: string | null;
    phone: string;
    bio: string | null;
    dob: string;
    profile_image: string | null;
    banner_image: string | null;
    category_ids: number[] | null;
    email_verified_at: string | null;
    remember_token: string | null;
    role: number;
    is_verified: number;
    post_count: number;
    admirer_count: number;
    admired_count: number;
    status: number;
    unq_id: string;
    created_at: string;
    updated_at: string;
    like_count: number;
    admire_permission: number;
    approve_admire_request: number;
    post_view_permission: number;
    admirers_view_permission: number;
    comment_permission: number;
    live_view_permission: number;
    followers: string;
    following: string;
    fcm_token: string | null;
    delete_acc_reason: string | null;
    verification_document: string | null;
    is_admin_verified: number;
    is_me: number;
    is_following: number;
    agora_username: string | null
    agora_bearer_token: string | null
    last_active_at: string
    unread_count: number
    last_receiver_user_id: number
    agora_chat_status: string
  };
}
