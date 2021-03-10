import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class User1615384748729 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const userTable = queryRunner.getTable('user');

    if (!userTable) {
      await queryRunner.createTable(
        new Table({
          name: 'user',
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
              length: '255',
            },
            {
              name: 'username',
              type: 'varchar',
              length: '255',
            },
            {
              name: 'name',
              type: 'varchar',
              length: '255',
              isNullable: true,
            },
            {
              name: 'password',
              type: 'varchar',
              length: '255',
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
          foreignKeys: [
            {
              name: 'resourceTypeId',
              columnNames: ['resourceTypeId'],
              referencedColumnNames: ['id'],
              referencedTableName: 'resource_type',
            },
          ],
        }),
        true,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
