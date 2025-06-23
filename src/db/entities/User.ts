import { RoleEnum } from 'src/utils/enums/RoleEnum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';



@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: 'varchar' })
    name!: string;

    @Column({ type: 'varchar' })
    email!: string;

    @Column({ type: 'varchar' })
    password!: string;

    @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.USER })
    role: RoleEnum

    @Column({ type: 'varchar' })
    login_provider?: string

    @Column({ type: 'date', default: new Date() })
    created_at?: Date;

    @Column({ type: 'boolean', default: true })
    is_active?: boolean

    @Column({ type: 'date' })
    updated_at?: Date;

    @Column({ type: 'date' })
    last_login?: Date
}
