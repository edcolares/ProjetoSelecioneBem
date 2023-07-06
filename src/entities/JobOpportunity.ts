import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Department } from "./Department";
import { JobOpportunity_Skill } from "./JobOpportunity_Skill";
import { User } from "./User";
import { Interview } from "./Interview";

@Entity('jobopportunity')
export class JobOpportunity {
    @PrimaryGeneratedColumn('increment', {
        comment: 'Identificador único e sequencial de forma crescente, atribuído pelo Banco de Dados.',
        primaryKeyConstraintName: "PK_JobOpportunity_Id"
    })
    id: number

    @Column({
        type: 'varchar',
        length: 100,
        comment: 'Código da oportunidade de emprego,'
    })
    jobCode: string

    @Column({
        type: 'varchar',
        length: 254,
        comment: 'Título descritivo da oportunidade de trabalho.'
    })
    title: string

    @Column({
        type: 'varchar',
        length: 50,
        comment: 'Nível da oportunidade de trabalho'
    })
    level: string

    @Column({
        type: 'date',
        comment: 'Data de abertura da oportunidade de trabalho'
    })
    openingDate: Date

    @Column({
        type: 'date',
        comment: 'Data esperada para a oportunidade de trabalho'
    })
    expectedDate: Date

    @Column({
        type: 'date',
        nullable: true,
        comment: 'Data de encerramento da oportunidade de trabalho'
    })
    closingDate: Date

    @CreateDateColumn({
        name: 'create_At',
        select: false,
        comment: 'Data de criação do registro'
    })
    createAt: Date

    @UpdateDateColumn({
        name: 'update_At',
        select: false, comment: 'Data de atualização do registro'
    })
    updateAt: Date

    @ManyToOne(() => Department, department => department.jobopportunities)
    @JoinColumn({
        name: "FK_departmentId",
        foreignKeyConstraintName: "FK_constraint_departmentId_jobOpportunities"
    })
    department: Department;

    @ManyToOne(() => User, user => user.jobopportunities)
    @JoinColumn({
        name: "FK_userId",
        foreignKeyConstraintName: "FK_constraint_userId_jobOpportunities"
    })
    user: User

    @OneToMany(() => JobOpportunity_Skill, jobopportunity_Skill => jobopportunity_Skill.jobopportunity)
    jobopportunitySkills: JobOpportunity_Skill[]

    @OneToMany(() => Interview, interview => interview.jobopportunity)
    interviews: Interview[]
}