import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_about_page_support_items_icon" AS ENUM('compass', 'globe', 'message', 'sparkles');
  CREATE TABLE "about_page_who_we_are_paragraphs" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"text" varchar NOT NULL
  );

  CREATE TABLE "about_page_approach_principles" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"label" varchar NOT NULL
  );

  CREATE TABLE "about_page_support_items" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar NOT NULL,
	"icon" "enum_about_page_support_items_icon" NOT NULL
  );

  CREATE TABLE "about_page_destination_stories_items" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"destination_id" integer NOT NULL,
	"label" varchar NOT NULL,
	"image_id" integer
  );

  CREATE TABLE "about_page_process_steps" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar NOT NULL
  );

  CREATE TABLE "about_page" (
	"id" serial PRIMARY KEY NOT NULL,
	"masthead_eyebrow" varchar NOT NULL,
	"masthead_headline" varchar NOT NULL,
	"masthead_description" varchar NOT NULL,
	"who_we_are_eyebrow" varchar NOT NULL,
	"who_we_are_headline" varchar NOT NULL,
	"who_we_are_image_id" integer,
	"who_we_are_image_caption" varchar,
	"who_we_are_image_title" varchar,
	"approach_eyebrow" varchar NOT NULL,
	"approach_headline" varchar NOT NULL,
	"approach_description" varchar NOT NULL,
	"support_eyebrow" varchar NOT NULL,
	"support_headline" varchar NOT NULL,
	"destination_stories_eyebrow" varchar NOT NULL,
	"destination_stories_headline" varchar NOT NULL,
	"destination_stories_description" varchar NOT NULL,
	"process_eyebrow" varchar NOT NULL,
	"process_headline" varchar NOT NULL,
	"cta_eyebrow" varchar NOT NULL,
	"cta_headline" varchar NOT NULL,
	"cta_description" varchar NOT NULL,
	"cta_primary_label" varchar DEFAULT 'Design Your Trip' NOT NULL,
	"cta_secondary_label" varchar DEFAULT 'Explore destinations' NOT NULL,
	"seo_meta_title" varchar,
	"seo_meta_description" varchar,
	"seo_social_image_id" integer,
	"seo_canonical_url" varchar,
	"updated_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE "contact_page" (
	"id" serial PRIMARY KEY NOT NULL,
	"masthead_eyebrow" varchar NOT NULL,
	"masthead_headline" varchar NOT NULL,
	"masthead_description" varchar NOT NULL,
	"form_eyebrow" varchar NOT NULL,
	"form_headline" varchar NOT NULL,
	"form_description" varchar NOT NULL,
	"form_submit_label" varchar DEFAULT 'Send inquiry' NOT NULL,
	"details_eyebrow" varchar NOT NULL,
	"details_headline" varchar NOT NULL,
	"details_description" varchar NOT NULL,
	"details_note_headline" varchar NOT NULL,
	"details_note_description" varchar NOT NULL,
	"details_note_cta_label" varchar DEFAULT 'Chat with us' NOT NULL,
	"social_eyebrow" varchar NOT NULL,
	"social_headline" varchar NOT NULL,
	"social_description" varchar NOT NULL,
	"seo_meta_title" varchar,
	"seo_meta_description" varchar,
	"seo_social_image_id" integer,
	"seo_canonical_url" varchar,
	"updated_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE "destinations_page" (
	"id" serial PRIMARY KEY NOT NULL,
	"masthead_eyebrow" varchar NOT NULL,
	"masthead_headline" varchar NOT NULL,
	"masthead_description" varchar NOT NULL,
	"masthead_mark_label" varchar DEFAULT 'destinations to begin with' NOT NULL,
	"listing_eyebrow" varchar NOT NULL,
	"listing_headline" varchar NOT NULL,
	"listing_description" varchar NOT NULL,
	"support_eyebrow" varchar NOT NULL,
	"support_headline" varchar NOT NULL,
	"support_description" varchar NOT NULL,
	"support_cta_label" varchar DEFAULT 'Talk to LDC Travel' NOT NULL,
	"seo_meta_title" varchar,
	"seo_meta_description" varchar,
	"seo_social_image_id" integer,
	"seo_canonical_url" varchar,
	"updated_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone
  );

  ALTER TABLE "site_settings" ALTER COLUMN "contact_saudi_office" SET DEFAULT '18th Floor, Al Faisaliah Tower
  King Fahd Road, Al Olaya District
  P.O. Box 54995
  Riyadh 11524, Kingdom of Saudi Arabia';
  ALTER TABLE "media" ADD COLUMN "source_url" varchar;
  ALTER TABLE "media" ADD COLUMN "caption" varchar;
  ALTER TABLE "destinations" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "destinations" ADD COLUMN "hero_image_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "public_email" varchar DEFAULT 'info@ldc-tourism.com' NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "contact_egypt_office_label" varchar DEFAULT 'Egypt' NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "contact_egypt_office_address" varchar DEFAULT '15 Mahmoud Essmat Hamdy, Sheraton' NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "contact_egypt_office_whatsapp_display" varchar DEFAULT '+20 12 11118118' NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "contact_egypt_office_whatsapp_number" varchar DEFAULT '201211118118' NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "contact_saudi_office_details_label" varchar DEFAULT 'Saudi Arabia' NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "contact_saudi_office_details_address" varchar DEFAULT '18th Floor, Al Faisaliah Tower
  King Fahd Road, Al Olaya District
  P.O. Box 54995
  Riyadh 11524, Kingdom of Saudi Arabia' NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "contact_saudi_office_details_whatsapp_display" varchar DEFAULT '+966 7277981053' NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "contact_saudi_office_details_whatsapp_number" varchar DEFAULT '9667277981053' NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "socials_egypt_instagram" varchar DEFAULT 'https://www.instagram.com/ldctravels.eg/';
  ALTER TABLE "site_settings" ADD COLUMN "socials_egypt_facebook" varchar DEFAULT 'https://www.facebook.com/profile.php?id=61591627376189';
  ALTER TABLE "site_settings" ADD COLUMN "socials_saudi_instagram" varchar DEFAULT 'https://www.instagram.com/elwajha_elraeda_travels/';
  ALTER TABLE "site_settings" ADD COLUMN "socials_saudi_facebook" varchar DEFAULT 'https://www.facebook.com/profile.php?id=61575912646557#';
  ALTER TABLE "site_settings" ADD COLUMN "branding_primary_logo_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "branding_footer_logo_id" integer;
  ALTER TABLE "homepage_inspiration_items" ADD COLUMN "destination_id" integer;
  ALTER TABLE "homepage_inspiration_items" ADD COLUMN "href" varchar;
  ALTER TABLE "homepage" ADD COLUMN "destinations_section_eyebrow" varchar DEFAULT 'The world, in focus' NOT NULL;
  ALTER TABLE "homepage" ADD COLUMN "destinations_section_headline" varchar DEFAULT 'Choose a place that feels like you.' NOT NULL;
  ALTER TABLE "homepage" ADD COLUMN "destinations_section_description" varchar DEFAULT 'Six destinations to start with, each offering a different way to see more of the world.' NOT NULL;
  ALTER TABLE "homepage" ADD COLUMN "destination_cta_form_eyebrow" varchar DEFAULT 'Start a conversation' NOT NULL;
  ALTER TABLE "homepage" ADD COLUMN "destination_cta_form_headline" varchar DEFAULT 'Tell us what you’re planning.' NOT NULL;
  ALTER TABLE "homepage" ADD COLUMN "destination_cta_form_description" varchar DEFAULT 'Share a few details and we’ll help shape the right next step.' NOT NULL;
  ALTER TABLE "homepage" ADD COLUMN "destination_cta_form_submit_label" varchar DEFAULT 'Send inquiry' NOT NULL;
  ALTER TABLE "homepage" ADD COLUMN "faq_section_eyebrow" varchar DEFAULT 'Good to know' NOT NULL;
  ALTER TABLE "homepage" ADD COLUMN "faq_section_headline" varchar DEFAULT 'Questions, answered simply.' NOT NULL;
  ALTER TABLE "homepage" ADD COLUMN "faq_section_description" varchar DEFAULT 'Still choosing? Start a conversation with the LDC Travel team.' NOT NULL;
  ALTER TABLE "homepage" ADD COLUMN "seo_meta_title" varchar;
  ALTER TABLE "homepage" ADD COLUMN "seo_meta_description" varchar;
  ALTER TABLE "homepage" ADD COLUMN "seo_social_image_id" integer;
  ALTER TABLE "homepage" ADD COLUMN "seo_canonical_url" varchar;
  ALTER TABLE "about_page_who_we_are_paragraphs" ADD CONSTRAINT "about_page_who_we_are_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_approach_principles" ADD CONSTRAINT "about_page_approach_principles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_support_items" ADD CONSTRAINT "about_page_support_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_destination_stories_items" ADD CONSTRAINT "about_page_destination_stories_items_destination_id_destinations_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_destination_stories_items" ADD CONSTRAINT "about_page_destination_stories_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_destination_stories_items" ADD CONSTRAINT "about_page_destination_stories_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_process_steps" ADD CONSTRAINT "about_page_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_who_we_are_image_id_media_id_fk" FOREIGN KEY ("who_we_are_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_seo_social_image_id_media_id_fk" FOREIGN KEY ("seo_social_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_page" ADD CONSTRAINT "contact_page_seo_social_image_id_media_id_fk" FOREIGN KEY ("seo_social_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "destinations_page" ADD CONSTRAINT "destinations_page_seo_social_image_id_media_id_fk" FOREIGN KEY ("seo_social_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "about_page_who_we_are_paragraphs_order_idx" ON "about_page_who_we_are_paragraphs" USING btree ("_order");
  CREATE INDEX "about_page_who_we_are_paragraphs_parent_id_idx" ON "about_page_who_we_are_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "about_page_approach_principles_order_idx" ON "about_page_approach_principles" USING btree ("_order");
  CREATE INDEX "about_page_approach_principles_parent_id_idx" ON "about_page_approach_principles" USING btree ("_parent_id");
  CREATE INDEX "about_page_support_items_order_idx" ON "about_page_support_items" USING btree ("_order");
  CREATE INDEX "about_page_support_items_parent_id_idx" ON "about_page_support_items" USING btree ("_parent_id");
  CREATE INDEX "about_page_destination_stories_items_order_idx" ON "about_page_destination_stories_items" USING btree ("_order");
  CREATE INDEX "about_page_destination_stories_items_parent_id_idx" ON "about_page_destination_stories_items" USING btree ("_parent_id");
  CREATE INDEX "about_page_destination_stories_items_destination_idx" ON "about_page_destination_stories_items" USING btree ("destination_id");
  CREATE INDEX "about_page_destination_stories_items_image_idx" ON "about_page_destination_stories_items" USING btree ("image_id");
  CREATE INDEX "about_page_process_steps_order_idx" ON "about_page_process_steps" USING btree ("_order");
  CREATE INDEX "about_page_process_steps_parent_id_idx" ON "about_page_process_steps" USING btree ("_parent_id");
  CREATE INDEX "about_page_who_we_are_who_we_are_image_idx" ON "about_page" USING btree ("who_we_are_image_id");
  CREATE INDEX "about_page_seo_seo_social_image_idx" ON "about_page" USING btree ("seo_social_image_id");
  CREATE INDEX "contact_page_seo_seo_social_image_idx" ON "contact_page" USING btree ("seo_social_image_id");
  CREATE INDEX "destinations_page_seo_seo_social_image_idx" ON "destinations_page" USING btree ("seo_social_image_id");
  ALTER TABLE "destinations" ADD CONSTRAINT "destinations_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_branding_primary_logo_id_media_id_fk" FOREIGN KEY ("branding_primary_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_branding_footer_logo_id_media_id_fk" FOREIGN KEY ("branding_footer_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_inspiration_items" ADD CONSTRAINT "homepage_inspiration_items_destination_id_destinations_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_seo_social_image_id_media_id_fk" FOREIGN KEY ("seo_social_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "destinations_hero_image_idx" ON "destinations" USING btree ("hero_image_id");
  CREATE INDEX "site_settings_branding_branding_primary_logo_idx" ON "site_settings" USING btree ("branding_primary_logo_id");
  CREATE INDEX "site_settings_branding_branding_footer_logo_idx" ON "site_settings" USING btree ("branding_footer_logo_id");
  CREATE INDEX "homepage_inspiration_items_destination_idx" ON "homepage_inspiration_items" USING btree ("destination_id");
  CREATE INDEX "homepage_seo_seo_social_image_idx" ON "homepage" USING btree ("seo_social_image_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "about_page_who_we_are_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_approach_principles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_support_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_destination_stories_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_process_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "destinations_page" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "about_page_who_we_are_paragraphs" CASCADE;
  DROP TABLE "about_page_approach_principles" CASCADE;
  DROP TABLE "about_page_support_items" CASCADE;
  DROP TABLE "about_page_destination_stories_items" CASCADE;
  DROP TABLE "about_page_process_steps" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "contact_page" CASCADE;
  DROP TABLE "destinations_page" CASCADE;
  ALTER TABLE "destinations" DROP CONSTRAINT "destinations_hero_image_id_media_id_fk";

  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_branding_primary_logo_id_media_id_fk";

  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_branding_footer_logo_id_media_id_fk";

  ALTER TABLE "homepage_inspiration_items" DROP CONSTRAINT "homepage_inspiration_items_destination_id_destinations_id_fk";

  ALTER TABLE "homepage" DROP CONSTRAINT "homepage_seo_social_image_id_media_id_fk";

  DROP INDEX "destinations_hero_image_idx";
  DROP INDEX "site_settings_branding_branding_primary_logo_idx";
  DROP INDEX "site_settings_branding_branding_footer_logo_idx";
  DROP INDEX "homepage_inspiration_items_destination_idx";
  DROP INDEX "homepage_seo_seo_social_image_idx";
  ALTER TABLE "site_settings" ALTER COLUMN "contact_saudi_office" SET DEFAULT '18th Floor, Al Faisaliah Tower
King Fahd Road, Al Olaya District
P.O. Box 54995
Riyadh 11524, Kingdom of Saudi Arabia';
  ALTER TABLE "media" DROP COLUMN "source_url";
  ALTER TABLE "media" DROP COLUMN "caption";
  ALTER TABLE "destinations" DROP COLUMN "eyebrow";
  ALTER TABLE "destinations" DROP COLUMN "hero_image_id";
  ALTER TABLE "site_settings" DROP COLUMN "public_email";
  ALTER TABLE "site_settings" DROP COLUMN "contact_egypt_office_label";
  ALTER TABLE "site_settings" DROP COLUMN "contact_egypt_office_address";
  ALTER TABLE "site_settings" DROP COLUMN "contact_egypt_office_whatsapp_display";
  ALTER TABLE "site_settings" DROP COLUMN "contact_egypt_office_whatsapp_number";
  ALTER TABLE "site_settings" DROP COLUMN "contact_saudi_office_details_label";
  ALTER TABLE "site_settings" DROP COLUMN "contact_saudi_office_details_address";
  ALTER TABLE "site_settings" DROP COLUMN "contact_saudi_office_details_whatsapp_display";
  ALTER TABLE "site_settings" DROP COLUMN "contact_saudi_office_details_whatsapp_number";
  ALTER TABLE "site_settings" DROP COLUMN "socials_egypt_instagram";
  ALTER TABLE "site_settings" DROP COLUMN "socials_egypt_facebook";
  ALTER TABLE "site_settings" DROP COLUMN "socials_saudi_instagram";
  ALTER TABLE "site_settings" DROP COLUMN "socials_saudi_facebook";
  ALTER TABLE "site_settings" DROP COLUMN "branding_primary_logo_id";
  ALTER TABLE "site_settings" DROP COLUMN "branding_footer_logo_id";
  ALTER TABLE "homepage_inspiration_items" DROP COLUMN "destination_id";
  ALTER TABLE "homepage_inspiration_items" DROP COLUMN "href";
  ALTER TABLE "homepage" DROP COLUMN "destinations_section_eyebrow";
  ALTER TABLE "homepage" DROP COLUMN "destinations_section_headline";
  ALTER TABLE "homepage" DROP COLUMN "destinations_section_description";
  ALTER TABLE "homepage" DROP COLUMN "destination_cta_form_eyebrow";
  ALTER TABLE "homepage" DROP COLUMN "destination_cta_form_headline";
  ALTER TABLE "homepage" DROP COLUMN "destination_cta_form_description";
  ALTER TABLE "homepage" DROP COLUMN "destination_cta_form_submit_label";
  ALTER TABLE "homepage" DROP COLUMN "faq_section_eyebrow";
  ALTER TABLE "homepage" DROP COLUMN "faq_section_headline";
  ALTER TABLE "homepage" DROP COLUMN "faq_section_description";
  ALTER TABLE "homepage" DROP COLUMN "seo_meta_title";
  ALTER TABLE "homepage" DROP COLUMN "seo_meta_description";
  ALTER TABLE "homepage" DROP COLUMN "seo_social_image_id";
  ALTER TABLE "homepage" DROP COLUMN "seo_canonical_url";
  DROP TYPE "public"."enum_about_page_support_items_icon";`)
}
