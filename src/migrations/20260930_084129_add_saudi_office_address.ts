import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ALTER COLUMN "contact_reservations_email" SET DEFAULT 'info@ldc-tourism.com';
  ALTER TABLE "site_settings" ALTER COLUMN "contact_sales_email" SET DEFAULT 'info@ldc-tourism.com';
  ALTER TABLE "site_settings" ADD COLUMN "contact_saudi_office" varchar DEFAULT 'الطابق 18برج الفصيلة،طريق الملك فهد حي العليا ص.ب54995،الرياض11524،المملكه العربيه السعودية';`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ALTER COLUMN "contact_reservations_email" SET DEFAULT 'reservations@ldc-tourism.com';
  ALTER TABLE "site_settings" ALTER COLUMN "contact_sales_email" SET DEFAULT 'sales@ldc-tourism.com';
  ALTER TABLE "site_settings" DROP COLUMN "contact_saudi_office";`)
}
