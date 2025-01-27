"use server";

import { API_BASE_PATH } from "./configs";
import { Api_Response, Error_Response, TypeRequest } from "./types";

export const API_GET = async <TResult>(
  path: string,
  id?: number,
  options?: RequestInit
): Promise<Api_Response<TResult> | Error_Response> => {
  try {
    const response = await FetCh<TResult>("GET", path, undefined, id, options);
    return response;
  } catch (error) {
    console.error(`GET request to ${path} failed:`, error);
    throw error;
  }
};

export const API_POST = async <TRequest, TResult>(
  data: TRequest,
  path: string,
  id?: number,
  options?: RequestInit
): Promise<Api_Response<TResult> | Error_Response> => {
  try {
    const response = await FetCh<TResult, TRequest>("POST", path, data, id, options);
    return response;
  } catch (error) {
    console.error(`POST request to ${path} failed:`, error);
    throw error;
  }
};

export const API_PATCH = async <TRequest, TResult>(
  data: Partial<TRequest>,
  path: string,
  id?: number,
  options?: RequestInit
): Promise<Api_Response<TResult> | Error_Response> => {
  try {
    const response = await FetCh<TResult, TRequest>("PATCH", path, data, id, options);
    return response;
  } catch (error) {
    console.error(`PATCH request to ${path} failed:`, error);
    throw error;
  }
};

export const API_DELETE = async <TResult>(
  id: number,
  path: string,
  options?: RequestInit
): Promise<Api_Response<TResult> | Error_Response> => {
  try {
    const response = await FetCh<TResult>("DELETE", path, undefined, id, options);
    return response;
  } catch (error) {
    console.error(`PATCH request to ${path} failed:`, error);
    throw error;
  }
};

const FetCh = async <TResult, TRequest = void>(
  method: TypeRequest,
  path: string,
  data?: TRequest | Partial<TRequest>,
  id?: number,
  options?: RequestInit,
  timeout = 5000
): Promise<Api_Response<TResult> | Error_Response> => {
  const params = id ? `/${id}` : "";

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const request_options: RequestInit = {
    method: method,
    headers: {
      ...options?.headers,
    },
    ...(data ? { body: JSON.stringify(data) } : {}),
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_PATH}${path}${params}`, request_options);

    clearTimeout(timeoutId);
    if (!response.ok) {
      const responseError = await response.json();
      return {
        success: false,
        statusCode: response.status,
        message: responseError?.message,
      } as Error_Response;
    }
    const result: TResult = await response.json();
    return { success: true, data: result } as Api_Response<TResult>;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      return {
        success: false,
        statusCode: 500,
        message: "Request timeout exceeded.",
      } as Error_Response;
    }
    return {
      success: false,
      statusCode: 500,
      message: error.message,
    } as Error_Response;
  }
};
