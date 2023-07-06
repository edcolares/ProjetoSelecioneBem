import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { JobOpportunity } from "./JobOpportunity";

@Entity('department')
export class Department {
  @PrimaryGeneratedColumn('increment', {
      comment: "Identificador único e sequencial, atribuído pelo banco de dados.",
      primaryKeyConstraintName: "PK_Department_Id"
  })
  id: number;

  @Column({ type: 'varchar', length: 80, comment: "Nome do departamento." })
  name: string;

  @Column({ type: 'boolean', default: 'true', comment: "Indicador se o departamento está ativo." })
  isActive: boolean;

  @Column({ type: 'varchar', length: 150, comment: "Nome do gerente responsável pelo departamento." })
  manager: string;

  @Column({ type: 'varchar', length: 254, comment: "E-mail do departamento ou do gerente responsável." })
  email: string;

  @CreateDateColumn({ name: 'create_At', select: false, comment: "Data de criação do registro." })
  createAt: Date;

  @UpdateDateColumn({ name: 'update_At', select: false, comment: "Data de atualização do registro." })
  updateAt: Date;

  @OneToMany(() => JobOpportunity, jobopportunity => jobopportunity.department)
  jobopportunities: JobOpportunity[];
}