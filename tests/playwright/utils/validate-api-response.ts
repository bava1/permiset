import { ApiResponse } from "./interfaces/IApiResponse";
import { ApiValidationOptions } from "./interfaces/IApiValidationOptions";

/**
 * Validates the API response based on the given options.
 *
 * @param {ApiResponse} response - The API response to validate.
 * @param {ApiValidationOptions} [options] - The validation options.
 */
export function validateApiResponse(response: ApiResponse, options?: ApiValidationOptions) {
    if (options?.expectedStatus && response.status !== options.expectedStatus) {
        throw new Error(`Unexpected status: ${response.status}. Expected: ${options.expectedStatus}`);
    }

    if (options?.validateData) {
        if (!response.data || response.data.length === 0) {
            throw new Error('API response data is empty or null.');
        }

        if (options.minLength && response.data.length < options.minLength) {
            throw new Error(`API response data length is less than ${options.minLength}.`);
        }
    }
}