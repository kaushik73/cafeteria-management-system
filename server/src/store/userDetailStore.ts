import { IUser } from "../models/User";

export default class UserDetailStore {
  static userDetail: IUser | null;

  static setUserDetail(userDetail: IUser) {
    console.log("userDetail", userDetail);

    UserDetailStore.userDetail = userDetail;
  }

  static async getUserDetail(): Promise<IUser | null> {
    return UserDetailStore.userDetail;
  }

  static clearUserDetail() {
    UserDetailStore.userDetail = null;
  }
}
