import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { JobOpportunity } from "./JobOpportunity";

@Entity('department')
export class Department {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'varchar', length: 80 })
    name: string

    @Column({ type: 'boolean', default: 'true' })
    isActive: boolean

    @Column({ type: 'varchar', length: 150 })
    manager: string

    @Column({ type: 'varchar', length: 254 })
    email: string

    @CreateDateColumn({ name: 'create_At', select: false })
    createAt: Date

    @UpdateDateColumn({ name: 'update_At', select: false })
    updateAt: Date

    @OneToMany(() => JobOpportunity, jobopportunity => jobopportunity.department)
    jobopportunities: JobOpportunity[];
}