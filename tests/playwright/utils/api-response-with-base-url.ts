
import * as dotenv from 'dotenv';
import { validateApiResponse } from './validate-api-response';
import { ApiValidationOptions } from './interfaces/IApiValidationOptions';
import { ApiResponse } from './interfaces/IApiResponse';
import { APIRequestContext } from '@playwright/test';


/**
 * Performs a request to the specified path and returns a validated ApiResponse object.
 * 
 * The function will also validate the response based on the provided validation options.
 * 
 * @param {APIRequestContext} request - The context to use for the request.
 * @param {string} path - The path to request (relative or absolute).
 * @param {string} [method=GET] - The request method (e.g. GET, POST, PUT, DELETE).
 * @param {Record<string, string>} [headers] - Additional headers to send with the request.
 * @param {ApiValidationOptions} [validationOptions] - Options to validate the response.
 * @returns {Promise<ApiResponse>}
 */
export async function ApiResponseWithBaseURL(
    request: APIRequestContext,
    path: string,
    method: string = 'GET',
    headers: Record<string, string> = { 'Content-Type': 'application/json' },
    validationOptions?: ApiValidationOptions
): Promise<ApiResponse> {
    
    try {
        const baseURL = process.env.BASE_URL;
        if (!baseURL) {
            throw new Error('BASE_URL is not defined in the environment variables.');
        }

        const url = new URL(path, baseURL).toString();
        const response = await request.fetch(url, { method, headers });
        const status = response.status();
        const responseBody = await response.text();
        let data;

        try {
            data = responseBody ? JSON.parse(responseBody) : {};
        } catch (error) {
            throw new Error('Error parsing JSON data.');
        }

        // We are checking the status and data
        validateApiResponse({ status, data }, validationOptions);
        return { status, data };
        
    } catch (error: any) {
        // Handling different types of errors
        if (error.message.includes('ECONNREFUSED')) {
            throw new Error('Unable to connect to the server. Check your internet connection.');
        } else if (error.message.includes('ETIMEDOUT')) {
            throw new Error('The request timed out.');
        } else if (error.message.includes('ENOTFOUND')) {
            throw new Error('The DNS server could not find the specified host.');
        } else if (error.message.includes('ECONNRESET')) {
            throw new Error('The connection was broken.');
        } else if (error.message.includes('SSL')) {
            throw new Error('SSL Error: Problem with certificate.');
        } else {
            throw new Error(`Unknown request error: ${error.message}`);
        }
    }
    
}