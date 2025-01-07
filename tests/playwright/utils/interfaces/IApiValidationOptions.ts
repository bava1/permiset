export interface ApiValidationOptions {
    expectedStatus?: number;   // Expected response status
    validateData?: boolean;    // Is it necessary to check the availability of data?
    minLength?: number;        // Minimum data length (if array)
}