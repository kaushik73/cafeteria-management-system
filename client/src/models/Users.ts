export interface User {
    user_id: number;
    role: 'admin' | 'chef' | 'employee';
    name: string;
    email: string;
    emp_id?: number;
    password: string;
  }
  