import { IUserAndPreference } from "../models/User";

export default class UserDetailStore {
  static userDetail: IUserAndPreference | null;

  static setUserDetail(userDetail: IUserAndPreference) {
    console.log("UserDetailStore - userDetail", userDetail);

    UserDetailStore.userDetail = userDetail;
  }

  static async getUserDetail(): Promise<IUserAndPreference | null> {
    return UserDetailStore.userDetail;
  }

  static clearUserDetail() {
    UserDetailStore.userDetail = null;
  }
}
