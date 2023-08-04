import {MigrationInterface, QueryRunner, TableForeignKey} from "typeorm";

export class ForeignKeyForAdminFeed1691006646795 implements MigrationInterface {

    private foreignKey = new TableForeignKey({
        name: 'fk_admin_feed',
        columnNames: ['admin_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'admin',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('admin_feed');
        const ifForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('admin_id') !== -1);
        if (!ifForeignKey) {
            await queryRunner.createForeignKey(table, this.foreignKey);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('admin_feed');
        const ifForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('admin_id') !== -1);
        if (!ifForeignKey) {
            await queryRunner.dropForeignKey(table, this.foreignKey);
        }
    }

}
