import { useState, useEffect } from 'react';
import axios from 'axios';

const token = localStorage.getItem('token');
const axiosInstance = axios.create({
  baseURL: 'https://gomisteria-api.onrender.com/api',
  headers: {
    'Authorization': `Bearer ${token}`,
  }
});

type FetchFunction<T, Args extends any[]> = (...args: Args) => Promise<T>;

function useFetchData<T, Args extends any[]>(
  fetchFunction: FetchFunction<T, Args>,
  ...args: Args
) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchFunction(...args);
        setData(result);
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchFunction, ...args]);

  return { data, isLoading, error };
}
export default useFetchData;

export const getUserById = async (id: any, token: any): Promise<any> => {
  const response = await axios.get(`https://gomisteria-api.onrender.com/api/users/${id}`, {
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
  });
  return response?.data ?? null;
};
/**
 * * Sales
 */
export const getOrders = async (): Promise<any> => {
  const response = await axiosInstance.get(`/orders`);
  return response?.data ?? null;
};

export const getOrdersByUserId = async (id: any, page?: number, limit?: number): Promise<any> => {
  const response = await axiosInstance.get(`/orders/user/${id}?page=${page}&limit=${limit}`);
  return response?.data ?? null;
};

export const getOrderById = async (id: any): Promise<any> => {
  const response = await axiosInstance.get(`/orders/${id}`);
  return response?.data ?? null;
};

export const assignOrderToEmployee = async (data: any) => {
  const response = await axiosInstance.post('/users/assignOrder', data);
  return response.data;
};

export const updateOrderStatus = async (orderId: any, newStatus: any) => {
  try {
    const response = await axiosInstance.put(
      `/orders/${orderId}/status`,
      { newStatus },
      {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update order status:", error);
    throw error;
  }
};
/**
 * * Products
 */
export const getProducts = async (page?: number, limit?: number, query?: string): Promise<any> => {
  const response = await axiosInstance.get(`/products?page=${page}&limit=${limit}${query}`);
  return response?.data ?? null;
};

export const getSearchProducts = async (page?: number, limit?: number, query?: string): Promise<any> => {
  const response = await axiosInstance.get(`/products?page=${page}&limit=10${query}`);
  return response?.data ?? null;
};

export const getProductsByCategory = async (category: string, page?: number, limit?: number): Promise<any> => {
  const response = await axiosInstance.get(`/products?page=${page}&limit=${limit}&category=${category}`);
  return response?.data ?? null;
};

export const getProductsById = async (id: any): Promise<any> => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response?.data ?? null;
};
/**
 * * Businesses
 */
export const getBusinesses = async (): Promise<any> => {
  const response = await axiosInstance.get(`/users/businesses`);
  return response?.data ?? null;
};

export const activateBusiness = async (business: any) => {
  try {
    const response = await axiosInstance.put(
      `/users/activate/${business.id}`,
      {},
    );
    return response?.data ?? null;
  } catch (error) {
    console.error("Failed to activate business:", error);
    throw error;
  }
};
/**
 * * Services
 */
export const getServices = async (query?: string): Promise<any> => {
  const response = await axiosInstance.get(`/services`);
  return response?.data ?? null;
};

export const getServiceOrders = async (query?: string): Promise<any> => {
  const response = await axiosInstance.get(`/service-orders`);
  return response?.data ?? null;
};

export const approveService = async (id: string, status: string) => {
  try {
    const response = await axiosInstance.patch(`/service-orders/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};
/**
 * * Reservations
 */
export const getPreorders = async (page?: number, limit?: number): Promise<any> => {
  const response = await axiosInstance.get(`/ngarkesa/preorders?page=${page}&limit=${limit}`);
  return response?.data ?? null;
};

export const getPreorderById = async (id: any): Promise<any> => {
  const response = await axiosInstance.get(`/ngarkesa/preorder/${id}`);
  return response?.data ?? null;
};

export const updatePreorderStatus = async (id: any, status: string) => {
  const response = await axiosInstance.patch(`/ngarkesa/preorder/${id}/status`, { status });
  return response.data;
};
/**
 * * Loads
 */
export const getNgarkesat = async (page?: number, limit?: number, query?: string): Promise<any> => {
  const response = await axiosInstance.get(`/ngarkesa?page=${page}&limit=${limit}${query}`);
  return response?.data ?? null;
};

export const getNgarkesaById = async (id: any): Promise<any> => {
  const response = await axiosInstance.get(`/ngarkesa/${id}`);
  return response?.data ?? null;
};

export const createNgarkesa = async (ngarkesaData: any) => {
  const response = await axiosInstance.post('/ngarkesa', ngarkesaData);
  return response.data;
};

export const addProductsToNgarkesa = async (ngarkesaId: any, products: any) => {
  const response = await axiosInstance.post(`/ngarkesa/${ngarkesaId}/products`, {
    products,
  });
  return response.data;
};
/**
 * * Employees
 */
export const getEmployees = async (): Promise<any> => {
  const response = await axiosInstance.get(`/users/employees`);
  return response?.data ?? null;
};

export const getEmployeeStatistics = async (id: any): Promise<any> => {
  const response = await axiosInstance.get(`/statistics/employee-statistics/${id}`);
  return response?.data ?? null;
};

export const getEmployeeOrdersByCountry = async (id: any): Promise<any> => {
  const response = await axiosInstance.get(`/statistics/employee-orders-by-country/${id}`);
  return response?.data ?? null;
};

export const getEmployeeOrdersByWeek = async (id: any): Promise<any> => {
  const response = await axiosInstance.get(`/statistics/employee-orders-completed-by-week/${id}`);
  return response?.data ?? null;
};
