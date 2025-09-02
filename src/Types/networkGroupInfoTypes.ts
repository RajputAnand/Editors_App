export interface NetworkGroup {
  code: number;
  success: boolean;
  message: string;
  data: {
    id: number;
    created_user_id: number;
    profile_photo: string;
    cover_photo: string;
    name: string;
    user_name: string;
    type: string;
    purpose: string;
    description: string;
    phone_code: string;
    phone_no: string;
    phone: string;
    email: string;
    location: string;
    website: string;
    country: string;
    member_count: number;
    admirer_count: number;
    admired_count: number;
    post_count: number;
    like_count: number;
    dislike_count: number;
    comment_count: number;
    status: number;
    created_at: string;
    updated_at: string;
    network_group_members: NetworkGroupMember[];
    is_joined: boolean;
    join_status: string;
    is_following: boolean;
    invitation_code: string;
    invitation_link: string;
    created_user: User;
    view_count: string;
    is_show_email: number;
  };
}

interface NetworkGroupMember {
  id: number;
  network_group_id: number;
  member_user_id: number;
  added_user_id: number;
  is_group_creator: number;
  post_count: number;
  like_count: number;
  dislike_count: number;
  comment_count: number;
  role: string;
  status: number;
  created_at: string;
  updated_at: string;
  member_user: User;
  added_user: User;
}

interface User {
  id: number;
  name: string;
  email: string;
  user_name: string | null;
  phone: string | null;
  bio: string | null;
  dob: string;
  profile_image: string | null;
  banner_image: string | null;
  category_ids: string | null;
  email_verified_at: string | null;
  remember_token: string | null;
  role: number;
  otp: number;
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
}
