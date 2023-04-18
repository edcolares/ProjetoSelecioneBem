import { BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Interview } from "./Interview"
import { Opportunity } from "./Opportunity"
import * as bcrypt  from 'bcrypt'


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

    @CreateDateColumn({ name: 'create_At' })
    createAt: Date

    @UpdateDateColumn({ name: 'update_At' })
    updateAt: Date

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    @OneToMany(() => Opportunity, opportunity => opportunity.user)
    opportunities: Opportunity[];

    @OneToMany(() => Interview, interview => interview.user)
    interviews: Interview[];
}