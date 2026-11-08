#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/97e0bccbf4623565518109e611bda10f6f20673efd6740b2d451a5045b7e4427/contract';
import startContract from '../../snapshots/97e0bccbf4623565518109e611bda10f6f20673efd6740b2d451a5045b7e4427/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/cfe9542dc68a86f472c3daa70d5c28d22560ee08ff8246e60eb155f3d5122e4f/contract';
import endContract from '../../snapshots/cfe9542dc68a86f472c3daa70d5c28d22560ee08ff8246e60eb155f3d5122e4f/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropConstraint({ schema: 'public', table: 'User', constraint: 'User_email_key' }),
      this.createTable({
        schema: 'public',
        table: 'Page',
        columns: [
          col('configuration', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('page_id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
