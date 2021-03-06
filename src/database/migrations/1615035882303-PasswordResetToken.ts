import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class PasswordResetToken1615035882303 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'password_reset_token',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '100',
            isUnique: true,
          },
          {
            name: 'token',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'createdAt',
            type: 'TIMESTAMP',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'TIMESTAMP',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
