export interface Menu {
    menu_id: number;
    item_name: string;
    price: number;
    availability_status: boolean;
    meal_type: 'lunch' | 'dinner' | 'breakfast';
  }

