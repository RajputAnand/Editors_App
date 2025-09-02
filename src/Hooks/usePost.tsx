import { useMutationQuery } from "../Api/QueryHooks/useMutationQuery.tsx";
import { Endpoints } from "../Api/Endpoints.ts";
import { UseMutationOptions } from "@tanstack/react-query";

export function usePost() {
  const like = (args?: UseMutationOptions) => {
    return useMutationQuery(
      { mutationKey: [Endpoints.LikePost, "POST"], ...args },
      false
    );
  };

  const unLike = (args?: UseMutationOptions) => {
    return useMutationQuery(
      { mutationKey: [Endpoints.NetworkPostLike, "POST"], ...args },
      false
    );
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
  const deletePostPin = (args?: UseMutationOptions) => {
    return useMutationQuery(
      { mutationKey: [Endpoints.DeletePostPin, "DELETE"], ...args },
      false
    );
  };
  const deletePostTag = (args?: UseMutationOptions) => {
    return useMutationQuery(
      { mutationKey: [Endpoints.DeletePostTag, "DELETE"], ...args },
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
  };
}
