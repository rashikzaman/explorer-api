import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class WebsiteResourceType1615051189000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'website_resource_type',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            generationStrategy: 'increment',
          },
          {
            name: 'domain',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'resourceTypeId',
            type: 'int',
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

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
