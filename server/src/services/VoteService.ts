import { sqlDBOperations } from "../database/operations/sqlDBOperations";

class VoteService {
  static async getEmployeeVotes() {
    const employeeVotes: any[] = await sqlDBOperations.runCustomQuery(`
        select  M.menu_id , M.item_name as item_name ,count(VI.is_voted) as total_vote from votedItem VI INNER JOIN Menu M on  M.menu_id = VI.menu_id group by menu_id order by count(is_voted) desc
`);
    return employeeVotes;
  }
}

export default VoteService;
