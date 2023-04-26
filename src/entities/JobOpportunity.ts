import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Department } from "./Department";
import { JobOpportunity_Skill } from "./JobOpportunity_Skill";
import { User } from "./User";
import { Interview } from "./Interview";

@Entity('jobopportunity')
export class JobOpportunity {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'varchar', length: 254 })
    title: string

    @Column({ type: 'varchar', length: 50 })
    level: string

    @Column({ type: 'date' })
    openingDate: Date

    @Column({ type: 'date' })
    expectedDate: Date

    @Column({ type: 'date', nullable: true })
    closingDate: Date

    @CreateDateColumn({ name: 'create_At', select: false })
    createAt: Date

    @UpdateDateColumn({ name: 'update_At', select: false })
    updateAt: Date

    @ManyToOne(() => Department, department => department.jobopportunities)
    @JoinColumn({ name: "FK_departmentId" })
    department: Department;

    @OneToMany(() => JobOpportunity_Skill, jobopportunity_Skill => jobopportunity_Skill.jobopportunity/*, { eager: true }*/)
    jobopportunitySkills: JobOpportunity_Skill[]

    @ManyToOne(() => User, user => user.jobopportunities)
    @JoinColumn({ name: "FK_userId" })
    user: User

    @OneToMany(() => Interview, interview => interview.jobopportunity)
    interviews: Interview[]
}