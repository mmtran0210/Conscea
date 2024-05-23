import config from '../config';
const API_BASE_URL = config.API_URL;

/**
 * Get's all employees with or without a specific certificate for a specific year
 *
 * @param {object} filter The filter object {certificateId: number, year: number}
 * @returns An array of employees with their certificate details (if the employee has the certificate, otherwise the certificate details will be null), and adoption rate
 * {employeeCertificates, adoptionRate}
 */
export const filterEmployeesCertificates = async (filter) => {
  const response = await fetch(
    `${API_BASE_URL}/Search?certificateId=${filter.certificateId}&year=${filter.year}`,
    {
      method: 'GET',
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to fetch certificates');
  }

  return await response.json();
};
