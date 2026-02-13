"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Document {
  id: string;
  name: string;
  description: string | null;
  file_key: string;
  file_size: number;
  mime_type: string;
  version: number;
  control_id: string | null;
  task_id: string | null;
  organization_id: string;
  uploaded_by_id: string;
  created_at: string;
  updated_at: string;
}

interface DocumentsResponse {
  documents: Document[];
  total: number;
  total_size: number;
}

interface PresignedUploadResponse {
  upload_url: string;
  file_key: string;
  expires_in: number;
}

interface UploadFileParams {
  file: File;
  name?: string;
  description?: string;
  controlId?: string;
  taskId?: string;
}

// Helper to get auth token (placeholder - implement based on your auth system)
function getAuthToken(): string | null {
  // TODO: Replace with actual auth token retrieval
  // e.g., from localStorage, cookie, or auth context
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
}

function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// Fetch all documents
export function useDocuments(params?: {
  controlId?: string;
  taskId?: string;
  search?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.controlId) {
    searchParams.set("control_id", params.controlId);
  }
  if (params?.taskId) {
    searchParams.set("task_id", params.taskId);
  }
  if (params?.search) {
    searchParams.set("search", params.search);
  }

  const queryString = searchParams.toString();
  const url = `${API_URL}/api/documents${queryString ? `?${queryString}` : ""}`;

  return useQuery<Document[]>({
    queryKey: ["documents", params],
    queryFn: async () => {
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }
      const data: DocumentsResponse = await response.json();
      return data.documents;
    },
  });
}

// Get presigned upload URL
async function getPresignedUploadUrl(
  filename: string,
  contentType: string
): Promise<PresignedUploadResponse> {
  const response = await fetch(`${API_URL}/api/documents/presigned-upload`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      filename,
      content_type: contentType,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get upload URL");
  }

  return response.json();
}

// Upload file to S3 using presigned URL
async function uploadToS3(uploadUrl: string, file: File): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!response.ok) {
    throw new Error("Failed to upload file to S3");
  }
}

// Create document record after S3 upload
async function createDocumentRecord(params: {
  name: string;
  fileKey: string;
  fileSize: number;
  mimeType: string;
  description?: string;
  controlId?: string;
  taskId?: string;
}): Promise<Document> {
  const response = await fetch(`${API_URL}/api/documents/confirm-upload`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      name: params.name,
      file_key: params.fileKey,
      file_size: params.fileSize,
      mime_type: params.mimeType,
      description: params.description,
      control_id: params.controlId,
      task_id: params.taskId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create document record");
  }

  return response.json();
}

// Upload file mutation (combines presigned URL + S3 upload)
export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, name, description, controlId, taskId }: UploadFileParams) => {
      // Step 1: Get presigned upload URL
      const { upload_url, file_key } = await getPresignedUploadUrl(
        file.name,
        file.type || "application/octet-stream"
      );

      // Step 2: Upload to S3
      await uploadToS3(upload_url, file);

      // Step 3: Confirm upload and create document record
      const document = await createDocumentRecord({
        name: name || file.name,
        fileKey: file_key,
        fileSize: file.size,
        mimeType: file.type || "application/octet-stream",
        description,
        controlId,
        taskId,
      });

      return document;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}

// Direct upload mutation (alternative - uploads via backend)
export function useDirectUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, name, description, controlId, taskId }: UploadFileParams) => {
      const formData = new FormData();
      formData.append("file", file);
      if (name) formData.append("name", name);
      if (description) formData.append("description", description);
      if (controlId) formData.append("control_id", controlId);
      if (taskId) formData.append("task_id", taskId);

      const token = getAuthToken();
      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/api/documents/upload`, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload document");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}

// Delete document mutation
export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_URL}/api/documents/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to delete document");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}

// Update document mutation
export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      description,
      controlId,
      taskId,
    }: {
      id: string;
      name?: string;
      description?: string;
      controlId?: string;
      taskId?: string;
    }) => {
      const response = await fetch(`${API_URL}/api/documents/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name,
          description,
          control_id: controlId,
          task_id: taskId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update document");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}

// Get download URL
export function useDownloadUrl() {
  return useMutation({
    mutationFn: async (documentId: string) => {
      const response = await fetch(`${API_URL}/api/documents/${documentId}/download`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to get download URL");
      }

      const data = await response.json();
      return data.download_url as string;
    },
  });
}
