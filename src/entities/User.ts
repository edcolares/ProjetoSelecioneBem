import { BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Interview } from "./Interview"
import { JobOpportunity } from "./JobOpportunity"
import * as bcrypt from 'bcrypt'


@Entity('user')
export class User {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'varchar', length: 120 })
    name: string

    @Column({ type: 'varchar', unique: true, length: 254 })
    email: string

    @Column({ type: 'varchar', length: 254, select: false })
    password: string

    @Column({ type: 'boolean', default: 'true' })
    isActive: boolean

    @CreateDateColumn({ name: 'create_At', select: false })
    createAt: Date

    @UpdateDateColumn({ name: 'update_At', select: false })
    updateAt: Date

    @DeleteDateColumn({ name: 'remove_At', select: false })
    removeAt: Date

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    @OneToMany(() => JobOpportunity, jobopportunity => jobopportunity.user)
    jobopportunities: JobOpportunity[];

    @OneToMany(() => Interview, interview => interview.user)
    interviews: Interview[];
}