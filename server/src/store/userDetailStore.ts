import { User } from "../models/Users";

export default class UserDetailStore {
  static userDetail: User | null;

  static setUserDetail(userDetail: User) {
    console.log("userDetail", userDetail);

    UserDetailStore.userDetail = userDetail;
  }

  static async getUserDetail(): Promise<User | null> {
    return UserDetailStore.userDetail;
  }

  static clearUserDetail() {
    UserDetailStore.userDetail = null;
  }
}
