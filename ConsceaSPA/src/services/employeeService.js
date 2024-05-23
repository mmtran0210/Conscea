import config from '../config';
const API_BASE_URL = config.API_URL;

/**
 * Get all employees
 *
 * @returns An array of employees
 */
export const getAllEmployees = async () => {
  const response = await fetch(`${API_BASE_URL}/Employees`, {
    method: 'GET',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to fetch employees');
  }

  return await response.json();
};

/**
 * Get an employee by id
 *
 * @param {number} id The id of the employee
 * @returns The employee object
 */
export const getEmployee = async (id) => {
  const response = await fetch(`${API_BASE_URL}/Employees/${id}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to fetch employee');
  }

  return await response.json();
};

/**
 * Gets the certificates of an employee
 *
 * @param {number} id The id of the employee
 * @returns An array of certificates with their expiry and certification date
 */
export const getEmployeeCertificates = async (id) => {
  const response = await fetch(`${API_BASE_URL}/Employees/${id}/certificates`, {
    method: 'GET',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to fetch employee');
  }

  return await response.json();
};

/**
 * Creates a certificate for an employee
 *
 * @param {number} id The id of the employee
 * @param {object} data The data needed to create a certificate {certificateId: number, certificationDate: string, validTillDate: string}
 */
export const createEmployeeCertificate = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/Employees/${id}/certificates`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to create certificate');
  }
};

/**
 * Updates a certificate for an employee
 *
 * @param {number} id The id of the employee
 * @param {number} ecId The id of the employee certificate
 * @param {object} data The data needed to update a certificate {certificateId: number, certificationDate: string, validTillDate: string}
 */
export const updateEmployeeCertificate = async (id, ecId, data) => {
  const response = await fetch(
    `${API_BASE_URL}/Employees/${id}/certificates/${ecId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to update certificate');
  }
};

/**
 * Deletes a certificate for an employee
 *
 * @param {number} id The id of the employee
 * @param {number} ecId The id of the employee certificate
 */
export const deleteEmployeeCertificate = async (id, ecId) => {
  const response = await fetch(
    `${API_BASE_URL}/Employees/${id}/certificates/${ecId}`,
    {
      method: 'DELETE',
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to delete certificate');
  }
};

/**
 * Gets a certificate for an employee
 *
 * @param {number} id The id of the employee
 * @param {number} ecId The id of the employee certificate
 * @returns The certificate with its expiry and certification date
 */
export const getEmployeeCertificate = async (id, ecId) => {
  const response = await fetch(
    `${API_BASE_URL}/Employees/${id}/certificates/${ecId}`,
    {
      method: 'GET',
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to fetch certificate');
  }

  return await response.json();
};

export const uploadEmployeePicture = async (id, file) => {
  const formData = new FormData();
  formData.append('avatarFile', file);
  const response = await fetch(`${API_BASE_URL}/Employees/${id}/Picture`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to upload picture');
  }

  return await response.json();
};
