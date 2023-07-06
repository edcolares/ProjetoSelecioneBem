import {
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Interview } from "./Interview";
import { JobOpportunity } from "./JobOpportunity";
import * as bcrypt from "bcryptjs";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn('increment',
    {
      comment: "Identificador único e sequencial de forma crescente, atribuído pelo Banco de Dados.",
      primaryKeyConstraintName: "PK_User_Id"
    })
  id: number;

  @Column({
    type: "varchar",
    length: 120,
    comment: "Nome definido pelo usuário."
  })
  name: string;

  @Column({
    type: "varchar",
    unique: true,
    length: 254,
    comment: "E-mail identificador do usuário, exclusivo e não atribuído à outro registro."
  })
  email: string;

  @Column({
    type: "varchar",
    length: 254,
    comment: "Senha definida pelo usuário e criptografada antes de ser armazenada com uso da biblioteca bcryptjs."
  })
  password: string;

  @Column({
    type: "boolean",
    default: "true",
    comment: "Indicador se o usuário é ativo."
  })
  isActive: boolean;

  @CreateDateColumn({
    name: "create_At",
    select: false,
    comment: 'Data de criação do registro'
  })
  createAt: Date;

  @UpdateDateColumn({
    name: "update_At",
    select: false,
    comment: 'Data de atualização do registro'
  })
  updateAt: Date;

  @DeleteDateColumn({
    name: "remove_At",
    select: false,
    comment: 'Data de exclusão do registro'
  })
  removeAt: Date;

  @BeforeUpdate()
  async hashPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
  }

  @OneToMany(() => JobOpportunity, (jobopportunity) => jobopportunity.user)
  jobopportunities: JobOpportunity[];

  @OneToMany(() => Interview, (interview) => interview.user)
  interviews: Interview[];
}