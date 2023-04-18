import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Opportunity } from "./Opportunity";

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

    @OneToMany(() => Opportunity, opportunity => opportunity.department)
    opportunities: Opportunity[];
}