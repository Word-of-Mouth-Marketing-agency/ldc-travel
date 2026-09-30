import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings"
      ALTER COLUMN "contact_saudi_office" SET DEFAULT '18th Floor, Al Faisaliah Tower
King Fahd Road, Al Olaya District
P.O. Box 54995
Riyadh 11524, Kingdom of Saudi Arabia';
    UPDATE "site_settings"
      SET "contact_saudi_office" = '18th Floor, Al Faisaliah Tower
King Fahd Road, Al Olaya District
P.O. Box 54995
Riyadh 11524, Kingdom of Saudi Arabia'
      WHERE "contact_saudi_office" = 'الطابق 18برج الفصيلة،طريق الملك فهد حي العليا ص.ب54995،الرياض11524،المملكه العربيه السعودية';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings"
      ALTER COLUMN "contact_saudi_office" SET DEFAULT 'الطابق 18برج الفصيلة،طريق الملك فهد حي العليا ص.ب54995،الرياض11524،المملكه العربيه السعودية';
    UPDATE "site_settings"
      SET "contact_saudi_office" = 'الطابق 18برج الفصيلة،طريق الملك فهد حي العليا ص.ب54995،الرياض11524،المملكه العربيه السعودية'
      WHERE "contact_saudi_office" = '18th Floor, Al Faisaliah Tower
King Fahd Road, Al Olaya District
P.O. Box 54995
Riyadh 11524, Kingdom of Saudi Arabia';
  `)
}
