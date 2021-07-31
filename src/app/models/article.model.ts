export type articleModel = {
  name: string;
  description: string;
  mintoRead: number;
  itSelf: string;
  owner: string;
  ownerId: string,
  tag: string;
  claps: number;
  imgURL?: string;
  id?: string;
  comment?: string[];
  isNewArticle ?: boolean
};
