import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Interview } from "./Interview"
import { Opportunity } from "./Opportunity"

@Entity('user')
export class User {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'varchar', length: 120 })
    name: string

    @Column({ type: 'varchar', unique: true, length: 254 })
    email: string

    @Column({ type: 'varchar', length: 32 })
    password: string

    @CreateDateColumn({ name: 'create_At' })
    createAt: Date

    @UpdateDateColumn({ name: 'update_At' })
    updateAt: Date

    @OneToMany((name: "Teste") => Opportunity, opportunity => opportunity.user)
    opportunities: Opportunity[];

    @OneToMany(() => Interview, interview => interview.user)
    interviews: Interview[];
}