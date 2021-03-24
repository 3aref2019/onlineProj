import {
  BeforeInsert,
  Column,
  Entity as TOEntity,
  Index,
  JoinColumn,
  ManyToOne,
} from "typeorm";

import Entity from "./Entity";
import Lesson from "./Lesson";
import User from "./User";
import { makeid } from "../utils/helpers";

@TOEntity("comments")
export default class Comment extends Entity {
  constructor(comment: Partial<Comment>) {
    super();
    Object.assign(this, comment);
  }

  @Index()
  @Column()
  identifier: string;

  @Column()
  body: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  imageUrn: string;
  
  @ManyToOne(() => User, (user) => user.comments, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @ManyToOne(() => Lesson, (lesson) => lesson.comments, {
    nullable: false,
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  lesson: Lesson;

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeid(8);
  }
}
