import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { JobOpportunity } from "./JobOpportunity";

@Entity('department')
export class Department {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'varchar', length: 80 })
    name: string

    @Column({ type: 'varchar', length: 150 })
    manager: string

    @Column({ type: 'varchar', length: 254, unique: true })
    email: string

    @OneToMany(() => JobOpportunity, jobopportunity => jobopportunity.department)
    jobopportunities: JobOpportunity[];
}