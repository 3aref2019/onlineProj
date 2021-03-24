import {
  Entity as ToEntity,
  Column,
  Index,
  OneToMany,
  BeforeInsert,
} from "typeorm";

import Entity from "./Entity";
import slug from "slug";
import { makeid } from "../utils/helpers";
import Sub from "./Sub";
import { Expose } from "class-transformer";

@ToEntity("courses")
export default class Course extends Entity {
  constructor(course: Partial<Course>) {
    super();
    Object.assign(this, course);
  }
  @Index()
  @Column({ unique: true })
  slug: string;

  @Index()
  @Column({ unique: true })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ default:"default.jpg" })
  imageUrn: string;

  //higher number ll ordered first
  @Column({ default: 1, nullable: true })
  apperance_order: number;

  @OneToMany(() => Sub, (sub: Sub) => sub.course)
  subs: Sub[];

  @BeforeInsert()
  makeSlug() {
    this.slug = slug(this.name, "_") + "_" + makeid(3);
  }
  @Expose() get subCategoriesCount(): number {
    return this.subs?.length;
  }
}
