import axios from "axios";
import httpService from "@/lib/http-services";
import { API_CONFIG } from "@/lib/contants";
import type { S3PreSignRequestDto, S3PreSignResponse } from "@/types/api.types";

/**
 * S3 SERVICE
 *
 * Handles unified S3 presigned URL generation and direct file uploads to AWS S3.
 */
const s3Service = {
  /**
   * POST /s3/pre-signed-url 🔒 Auth Required
   * Generate S3 presigned URLs for profile photos or deal media.
   */
  getPreSignedUrls: async (
    dto: S3PreSignRequestDto
  ): Promise<S3PreSignResponse[]> => {
    const res = await httpService.post<S3PreSignResponse[]>(
      API_CONFIG.S3.PRE_SIGNED_URL,
      dto
    );
    return res.data;
  },

  /**
   * POST to S3 🔓 Public
   * Directly upload a file blob to the presigned S3 POST location.
   * NOTE: This bypasses httpService interceptors to avoid sending bearer token headers.
   * Note that the signature policy requires S3 fields in exact order, followed by the file payload.
   */
  uploadToS3: async (
    presignedPost: S3PreSignResponse,
    file: Blob | File
  ): Promise<void> => {
    const formData = new FormData();
    // Enforce adding fields before file as required by AWS S3 POST policies
    Object.entries(presignedPost.fields).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("file", file);

    await axios.post(presignedPost.url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default s3Service;
