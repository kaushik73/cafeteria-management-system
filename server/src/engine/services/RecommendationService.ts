import { Menu } from "../../models/Menu";
import { Feedback } from "../../models/Feedback";
import { RecommendationAlgorithm } from "../index";
import SqlOperation from '../../database/operations/sqlDBOperations';

class RecommendationService {
    private db: SqlOperation;

    constructor() {
        this.db = new SqlOperation();
    }

    async getRecommendations(mealType: 'breakfast' | 'lunch' | 'dinner'): Promise<Menu[]> {
        const menuItems: Menu[] = await this.db.selectAll('Menu', { availability_status: true }) as Menu[];
        const recommendedItems = RecommendationAlgorithm.getTopRatedItems(menuItems, mealType);
        return recommendedItems;
    }

    async addNewMenuItem(item: Menu): Promise<void> {
        await this.db.insert('Menu', item);
        await this.db.insert('Feedback', {
            rating: 5,
            comment: 'New item',
            feedback_date: new Date(),
            user_id: 1, // Assuming user_id 1 for default rating
            menu_id: item.menu_id
        });
    }
}

export const recommendationService = new RecommendationService();
