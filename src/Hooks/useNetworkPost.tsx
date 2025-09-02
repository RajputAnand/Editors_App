import { useMutationQuery } from "../Api/QueryHooks/useMutationQuery.tsx";
import { Endpoints } from "../Api/Endpoints.ts";
import { UseMutationOptions } from "@tanstack/react-query";

export function useNetworkPost() {
  const like = (args?: UseMutationOptions) => {
    return useMutationQuery(
      { mutationKey: [Endpoints.NetworkPostLike, "POST"], ...args },
      false
    );
  };

  const unLike = (args?: UseMutationOptions) => {
    return useMutationQuery(
      { mutationKey: [Endpoints.NetworkPostLike, "POST"], ...args },
      false
    );
  };

  const unFollow = (args?: UseMutationOptions) => {
    return useMutationQuery({
      mutationKey: [Endpoints.UnFollowNetwork, "DELETE"],
      ...args,
    });
  };

  const follow = (args?: UseMutationOptions) => {
    return useMutationQuery({
      mutationKey: [Endpoints.FollowNetwork, "POST"],
      ...args,
    });
  };

  const deletePost = (args?: UseMutationOptions) => {
    return useMutationQuery(
      { mutationKey: [Endpoints.DeletePost, "DELETE"], ...args },
      false
    );
  };
  const reportPost = (args?: UseMutationOptions) => {
    return useMutationQuery(
      { mutationKey: [Endpoints.ReportPost, "POST"], ...args },
      false
    );
  };
  const reportCommentPost = (args?: UseMutationOptions) => {
    return useMutationQuery(
      { mutationKey: [Endpoints.ReportCommentPost, "POST"], ...args },
      false
    );
  };
  const notifications = (args?: UseMutationOptions) => {
    return useMutationQuery(
      { mutationKey: [Endpoints.Notifications, "POST"], ...args },
      false
    );
  };

  const deletePostTag = (args?: UseMutationOptions) => {
    return useMutationQuery(
      { mutationKey: [Endpoints.DeletePostTag, "DELETE"], ...args },
      false
    );
  };

  const joinNetwork = (args?: UseMutationOptions) => {
    return useMutationQuery(
      { mutationKey: [Endpoints.NetworkMemberJoin, "PUT"], ...args },
      false
    );
  };

  const deleteNetwork = (args?: UseMutationOptions) => {
    return useMutationQuery(
      { mutationKey: [Endpoints.DeleteNetwork, "DELETE"], ...args },
      false
    );
  };

  const updateNetworkMember = (args?: UseMutationOptions) => {
    return useMutationQuery(
      { mutationKey: [Endpoints.UpdateNetworkGroupMember, "PUT"], ...args },
      false
    );
  };

  const deleteNetworkMember = (args?: UseMutationOptions) => {
    return useMutationQuery(
      { mutationKey: [Endpoints.RemoveNetworkGroupMember, "DELETE"], ...args },
      false
    );
  };

  const acceptNetworkMember = (args?: UseMutationOptions) => {
    return useMutationQuery(
      { mutationKey: [Endpoints.AcceptNetworkMember, "PATCH"], ...args },
      false
    );
  };
  const rejectNetworkMember = (args?: UseMutationOptions) => {
    return useMutationQuery(
      { mutationKey: [Endpoints.RejectNetworkMember, "PATCH"], ...args },
      false
    );
  };

  const deletePostPin = (args?: UseMutationOptions) => {
    return useMutationQuery(
      { mutationKey: [Endpoints.UnpinNetworkPost, "DELETE"], ...args },
      false
    );
  };

  const postPin = (args?: UseMutationOptions) => {
    return useMutationQuery(
      { mutationKey: [Endpoints.PinNetworkPost, "POST"], ...args },
      false
    );
  };

  const inviteNetworkMember = (args?: UseMutationOptions) => {
    return useMutationQuery(
      { mutationKey: [Endpoints.InviteNetworkMembers, "PUT"], ...args },
      false
    );
  };

  return {
    like,
    unLike,
    deletePost,
    reportPost,
    notifications,
    deletePostPin,
    reportCommentPost,
    deletePostTag,
    joinNetwork,
    deleteNetwork,
    deleteNetworkMember,
    updateNetworkMember,
    acceptNetworkMember,
    rejectNetworkMember,
    postPin,
    inviteNetworkMember,
    unFollow,
    follow,
  };
}
