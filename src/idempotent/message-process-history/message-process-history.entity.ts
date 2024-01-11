import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'message_process_history' })
export class MessageProcessHistoryEntity {
  @PrimaryGeneratedColumn()
  public readonly id: string;

  @Column({ name: 'message_id' })
  @Index({ unique: true })
  public readonly messageId: string;

  @CreateDateColumn({ name: 'created_at' })
  public readonly createdAt: Date;
}
