import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Interview } from "./Interview";

@Entity('candidate')
export class Candidate {
    @PrimaryGeneratedColumn('increment', {
        comment: "Identificador único e sequencial, atribuído pelo banco de dados.",
        primaryKeyConstraintName: "PK_Candidate_Id"
    })
    id: number;

    @Column({ type: 'varchar', length: 150, comment: "Nome do candidato." })
    name: string;

    @Column({ type: 'varchar', length: 150, unique: true, comment: "E-mail do candidato, exclusivo e não atribuído a outro registro." })
    email: string;

    @CreateDateColumn({ name: 'create_At', select: false, comment: "Data de criação do registro." })
    createAt: Date;

    @UpdateDateColumn({ name: 'update_At', select: false, comment: "Data de atualização do registro." })
    updateAt: Date;

    @OneToMany(() => Interview, interview => interview.candidate)
    interviews: Interview[];
}