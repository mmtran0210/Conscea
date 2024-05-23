import config from '../config';
const API_BASE_URL = config.API_URL;

/**
 * Get all certificates
 *
 * @returns An array of certificates
 */
export const getAllCertificates = async () => {
  const response = await fetch(`${API_BASE_URL}/Certificates`, {
    method: 'GET',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to fetch certificates');
  }

  return await response.json();
};
