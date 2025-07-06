/**
 * Twitter Clone - API Client Configuration
 * 
 * This file handles all API communication between the mobile app and backend.
 * 
 * Features:
 * - Automatic Clerk authentication token injection
 * - Configurable base URL for local/production environments
 * - Organized API endpoints by feature (users, posts, comments)
 * 
 * Setup Notes:
 * - Production: Uses Vercel deployed backend with Arcjet bot protection in DRY_RUN mode
 * - Development: Switch to local IP address for physical device testing
 * - Localhost URLs won't work on physical devices - use your machine's IP instead
 */

import axios, { AxiosInstance } from "axios";
import { useAuth } from "@clerk/clerk-expo";

/**
 * API Configuration
 * 
 * Production: Uses deployed Vercel backend
 * Development: Switch to local IP for physical device testing
 * 
 * Note: Arcjet bot protection has been configured in DRY_RUN mode
 * to allow mobile app requests while still logging potential bot traffic
 */
const API_BASE_URL = "https://twitter-clone-flame-phi.vercel.app/api";

// For local development on physical devices (localhost won't work on real devices)
// const API_BASE_URL = "http://192.168.29.251:5001/api";

/**
 * Creates an authenticated API client with automatic token injection
 * Adds Bearer token to all requests when user is authenticated
 */
export const createApiClient = (
  getToken: () => Promise<string | null>
): AxiosInstance => {
  const api = axios.create({ baseURL: API_BASE_URL });

  api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return api;
};

/**
 * Hook to get an authenticated API client instance
 * Uses Clerk authentication to automatically handle token management
 */
export const useApiClient = (): AxiosInstance => {
  const { getToken } = useAuth();
  return createApiClient(getToken);
};

/**
 * User API endpoints
 * Handles user authentication, profile management, and user data
 */
export const userApi = {
  syncUser: (api: AxiosInstance) => api.post("/users/sync"),
  getCurrentUser: (api: AxiosInstance) => api.get("/users/me"),
  updateProfile: (api: AxiosInstance, data: any) =>
    api.put("/users/profile", data),
};

/**
 * Post API endpoints
 * Handles creating, retrieving, liking, and deleting posts
 */
export const postApi = {
  createPost: (api: AxiosInstance, data: { content: string; image?: string }) =>
    api.post("/posts", data),
  getPosts: (api: AxiosInstance) => api.get("/posts"),
  getUserPosts: (api: AxiosInstance, username: string) =>
    api.get(`/posts/user/${username}`),
  likePost: (api: AxiosInstance, postId: string) =>
    api.post(`/posts/${postId}/like`),
  deletePost: (api: AxiosInstance, postId: string) =>
    api.delete(`/posts/${postId}`),
};

/**
 * Comment API endpoints
 * Handles creating comments on posts
 */
export const commentApi = {
  createComment: (api: AxiosInstance, postId: string, content: string) =>
    api.post(`/comments/post/${postId}`, { content }),
};
