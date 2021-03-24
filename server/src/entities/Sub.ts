import {
  Entity as ToEntity,
  Column,
  Index,
  OneToMany,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from "typeorm";

import Entity from "./Entity";
import Lesson from "./Lesson";
import slug from "slug";
import { makeid } from "../utils/helpers";
import Course from "./Course";
import { Exclude, Expose } from "class-transformer";

@ToEntity("subs")
export default class Sub extends Entity {
  constructor(sub: Partial<Sub>) {
    super();
    Object.assign(this, sub);
  }
  //title
  @Column()
  title: string;

  //slug
  @Index()
  @Column({ unique: true })
  slug: string;

  //description
  @Column({ type: "text", nullable: true })
  description: string;

  //courseSlug
  @Column()
  courseSlug: string;
  @Exclude()
  @ManyToOne(() => Course, (course: Course) => course.subs, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({ referencedColumnName: "slug" })
  course: Course;

  @OneToMany(() => Lesson, (lesson) => lesson.sub)
  lessons: Lesson[];

  @BeforeInsert()
  makeSlug() {
    this.slug = slug(this.title, "_") + "_" + makeid(3);
  }
  @Expose() get lessonsCount(): number {
    return this.lessons?.length;
  }
  @Expose() get courseName(): string {
    return this.course?.name;
  }
}
