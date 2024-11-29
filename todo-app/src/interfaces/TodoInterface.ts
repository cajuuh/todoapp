import { WithId } from "./WithIdInterface";

export interface Todo extends WithId {
  _id: string;
  text: string;
  isDone: boolean;
}
