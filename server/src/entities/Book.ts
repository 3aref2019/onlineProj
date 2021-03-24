import { BeforeInsert, Column, Entity as TOEntity, Index } from "typeorm";

import Entity from "./Entity";
import slug from "slug";
import { makeid } from "../utils/helpers";

@TOEntity("books")
export default class Book extends Entity {
  constructor(book: Partial<Book>) {
    super();
    Object.assign(this, book);
  }
  @Index()
  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({ default: "defaultBook.jpg" })
  imageUrn: string;

  @Column({ nullable: true })
  link: string;

  @Column()
  description: string;

  @BeforeInsert()
  makeIdAndSlug() {
    this.slug = slug(this.title, "_") + "_" + makeid(3);
  }
}
