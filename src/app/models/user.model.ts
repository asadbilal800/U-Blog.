export type UserModel = {
  username?: string;
  email?: string;
  password?: string;
  displayImage?: string;
  userUID?: string;
  subscriptions?: string[];
  bookmarks?: string[];
  isNewUser?: boolean;
  bio?: string;
  notifications?: string[],
  newNotficationCount?: number
};

