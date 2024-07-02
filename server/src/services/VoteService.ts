import { sqlDBOperations } from "../database/operations/sqlDBOperations";
import DateService from "./DateService";

class VoteService {
  static async getEmployeeVotes() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 1);

    const startDateString = DateService.formatDateTime(startDate);
    const endDateString = DateService.formatDateTime(endDate);

    const employeeVotes: any[] = await sqlDBOperations.runCustomQuery(`
        select M.menu_id, M.item_name as item_name, count(VI.is_voted) as total_vote
        from votedItem VI
        INNER JOIN Menu M on M.menu_id = VI.menu_id
        where VI.vote_date between '${startDateString}' and '${endDateString}'
        group by M.menu_id
        order by count(VI.is_voted) desc
    `);
    return employeeVotes;
  }
}

export default VoteService;
