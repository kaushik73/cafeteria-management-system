// User.ts
import MenuItem from '../Menu/MenuItem';
import { IDatabaseOperations } from './IDatabaseOperations';

export class User {
  userID: number;
  name: string;
  role: string;
  employeeID: string;
  protected db: IDatabaseOperations;

  constructor(userID: number, name: string, role: string, employeeID: string, db: IDatabaseOperations) {
    this.userID = userID;
    this.name = name;
    this.role = role;
    this.employeeID = employeeID;
    this.db = db;
  }

  async login(): Promise<void> {
    // Logic for login
  }

  async logout(): Promise<void> {
    // Logic for logout
  }

  async viewMenu(): Promise<MenuItem[]> {
    return await this.db.selectAll<MenuItem>('Menu');
  }

  async viewNotifications(): Promise<Notification[]> {
    return await this.db.selectAll<Notification>('Notification', { userID: this.userID });
  }
}
