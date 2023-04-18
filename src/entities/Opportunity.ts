import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Department } from "./Department";
import { Opportunity_Skill } from "./Opportunity_Skill";
import { User } from "./User";
import { Interview } from "./Interview";

@Entity('opportunity')
export class Opportunity {
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

    @CreateDateColumn({ name: 'create_At' })
    createAt: Date

    @UpdateDateColumn({ name: 'update_At' })
    updateAt: Date

    @ManyToOne(() => Department, department => department.opportunities)
    @JoinTable()
    @JoinColumn({ name: "FK_departmentId" })
    department: Department;

    @OneToMany(() => Opportunity_Skill, opportunity_Skill => opportunity_Skill.opportunity)
    @JoinTable()
    opportunitySkills: Opportunity_Skill[]

    @ManyToOne(() => User, user => user.opportunities)
    @JoinTable()
    @JoinColumn({ name: "FK_userId" })
    user: User

    @OneToMany(() => Interview, interview => interview.opportunity)
    interviews: Interview[]
}