import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin');
  CREATE TYPE "public"."enum_destinations_status" AS ENUM('draft', 'published', 'archived');
  CREATE TYPE "public"."enum_travel_programs_starting_price_unit" AS ENUM('person', 'group', 'night');
  CREATE TYPE "public"."enum_travel_programs_status" AS ENUM('draft', 'published', 'archived');
  CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published', 'archived');
  CREATE TYPE "public"."enum_services_status" AS ENUM('draft', 'published', 'archived');
  CREATE TYPE "public"."enum_offers_status" AS ENUM('draft', 'published', 'archived');
  CREATE TYPE "public"."enum_guides_category" AS ENUM('Destination guide', 'Travel tips', 'Inspiration', 'Planning');
  CREATE TYPE "public"."enum_guides_status" AS ENUM('draft', 'published', 'archived');
  CREATE TYPE "public"."enum_inquiries_inquiry_type" AS ENUM('general', 'destination', 'custom-trip', 'other');
  CREATE TYPE "public"."enum_inquiries_status" AS ENUM('new', 'contacted', 'closed');
  CREATE TYPE "public"."enum_homepage_hero_primary_cta_kind" AS ENUM('whatsapp', 'internal', 'external');
  CREATE TYPE "public"."enum_homepage_hero_secondary_cta_kind" AS ENUM('whatsapp', 'internal', 'external');
  CREATE TYPE "public"."enum_homepage_destination_cta_primary_cta_kind" AS ENUM('whatsapp', 'internal', 'external');
  CREATE TYPE "public"."enum_homepage_destination_cta_secondary_cta_kind" AS ENUM('whatsapp', 'internal', 'external');
  CREATE TABLE "users_sessions" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"created_at" timestamp(3) with time zone,
	"expires_at" timestamp(3) with time zone NOT NULL
  );

  CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"role" "enum_users_role" DEFAULT 'admin',
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"email" varchar NOT NULL,
	"reset_password_token" varchar,
	"reset_password_expiration" timestamp(3) with time zone,
	"salt" varchar,
	"hash" varchar,
	"login_attempts" numeric DEFAULT 0,
	"lock_until" timestamp(3) with time zone
  );

  CREATE TABLE "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"alt" varchar NOT NULL,
	"credit" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"url" varchar,
	"thumbnail_u_r_l" varchar,
	"filename" varchar,
	"mime_type" varchar,
	"filesize" numeric,
	"width" numeric,
	"height" numeric,
	"focal_x" numeric,
	"focal_y" numeric,
	"sizes_thumbnail_url" varchar,
	"sizes_thumbnail_width" numeric,
	"sizes_thumbnail_height" numeric,
	"sizes_thumbnail_mime_type" varchar,
	"sizes_thumbnail_filesize" numeric,
	"sizes_thumbnail_filename" varchar,
	"sizes_card_url" varchar,
	"sizes_card_width" numeric,
	"sizes_card_height" numeric,
	"sizes_card_mime_type" varchar,
	"sizes_card_filesize" numeric,
	"sizes_card_filename" varchar,
	"sizes_hero_url" varchar,
	"sizes_hero_width" numeric,
	"sizes_hero_height" numeric,
	"sizes_hero_mime_type" varchar,
	"sizes_hero_filesize" numeric,
	"sizes_hero_filename" varchar
  );

  CREATE TABLE "markets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"code" varchar NOT NULL,
	"locale" varchar DEFAULT 'en-EG' NOT NULL,
	"currency_code" varchar DEFAULT 'EGP' NOT NULL,
	"currency_symbol" varchar DEFAULT 'EGP' NOT NULL,
	"is_default" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"is_public" boolean DEFAULT true,
	"contact_office" varchar,
	"contact_reservations_email" varchar,
	"contact_sales_email" varchar,
	"contact_whatsapp" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "destinations_highlights" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar NOT NULL,
	"image_id" integer,
	"image_url" varchar,
	"alt" varchar
  );

  CREATE TABLE "destinations_experiences" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar NOT NULL,
	"icon" varchar
  );

  CREATE TABLE "destinations_useful_information" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"label" varchar NOT NULL,
	"value" varchar NOT NULL
  );

  CREATE TABLE "destinations" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"country" varchar NOT NULL,
	"region_or_city" varchar,
	"summary" varchar NOT NULL,
	"content" jsonb,
	"overview" varchar,
	"cover_image_id" integer,
	"image_url" varchar,
	"best_time_to_visit" varchar,
	"featured" boolean DEFAULT false,
	"status" "enum_destinations_status" DEFAULT 'draft' NOT NULL,
	"seo_meta_title" varchar,
	"seo_meta_description" varchar,
	"seo_social_image_id" integer,
	"seo_canonical_url" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "destinations_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"media_id" integer,
	"markets_id" integer,
	"destinations_id" integer,
	"faqs_id" integer,
	"travel_programs_id" integer
  );

  CREATE TABLE "travel_programs_itinerary" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"day" numeric NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar NOT NULL
  );

  CREATE TABLE "travel_programs_highlights" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"item" varchar NOT NULL
  );

  CREATE TABLE "travel_programs_included" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"item" varchar NOT NULL
  );

  CREATE TABLE "travel_programs_not_included" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"item" varchar NOT NULL
  );

  CREATE TABLE "travel_programs" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"summary" varchar NOT NULL,
	"content" jsonb,
	"cover_image_id" integer,
	"image_url" varchar,
	"duration_days" numeric NOT NULL,
	"duration_label" varchar,
	"starting_price_amount" numeric NOT NULL,
	"starting_price_currency" varchar DEFAULT 'EGP' NOT NULL,
	"starting_price_unit" "enum_travel_programs_starting_price_unit" DEFAULT 'person',
	"starting_price_note" varchar,
	"price_note" varchar,
	"accommodation" varchar,
	"featured" boolean DEFAULT false,
	"status" "enum_travel_programs_status" DEFAULT 'draft' NOT NULL,
	"offer_id" integer,
	"whatsapp_message_override" varchar,
	"seo_meta_title" varchar,
	"seo_meta_description" varchar,
	"seo_social_image_id" integer,
	"seo_canonical_url" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "travel_programs_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"destinations_id" integer,
	"media_id" integer,
	"markets_id" integer
  );

  CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"location" varchar NOT NULL,
	"destination_id" integer,
	"start_date" timestamp(3) with time zone NOT NULL,
	"end_date" timestamp(3) with time zone,
	"summary" varchar NOT NULL,
	"content" jsonb,
	"cover_image_id" integer,
	"image_url" varchar,
	"featured" boolean DEFAULT false,
	"status" "enum_events_status" DEFAULT 'draft' NOT NULL,
	"seo_meta_title" varchar,
	"seo_meta_description" varchar,
	"seo_social_image_id" integer,
	"seo_canonical_url" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "events_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"markets_id" integer
  );

  CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"summary" varchar NOT NULL,
	"content" jsonb,
	"icon_key" varchar,
	"cover_image_id" integer,
	"featured" boolean DEFAULT false,
	"status" "enum_services_status" DEFAULT 'draft' NOT NULL,
	"seo_meta_title" varchar,
	"seo_meta_description" varchar,
	"seo_social_image_id" integer,
	"seo_canonical_url" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "services_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"markets_id" integer
  );

  CREATE TABLE "offers" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"badge" varchar,
	"headline" varchar NOT NULL,
	"description" varchar NOT NULL,
	"discount_label" varchar,
	"starts_at" timestamp(3) with time zone,
	"ends_at" timestamp(3) with time zone,
	"image_id" integer,
	"image_url" varchar,
	"cta_label" varchar DEFAULT 'Explore offer',
	"program_id" integer,
	"status" "enum_offers_status" DEFAULT 'draft' NOT NULL,
	"seo_meta_title" varchar,
	"seo_meta_description" varchar,
	"seo_social_image_id" integer,
	"seo_canonical_url" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "offers_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"markets_id" integer
  );

  CREATE TABLE "guides" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"summary" varchar NOT NULL,
	"excerpt" varchar NOT NULL,
	"content" jsonb,
	"category" "enum_guides_category",
	"cover_image_id" integer,
	"image_url" varchar,
	"published_at" timestamp(3) with time zone,
	"featured" boolean DEFAULT false,
	"status" "enum_guides_status" DEFAULT 'draft' NOT NULL,
	"seo_meta_title" varchar,
	"seo_meta_description" varchar,
	"seo_social_image_id" integer,
	"seo_canonical_url" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "guides_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"destinations_id" integer,
	"markets_id" integer
  );

  CREATE TABLE "testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"display_name" varchar NOT NULL,
	"location" varchar,
	"quote" varchar NOT NULL,
	"avatar_id" integer,
	"rating" numeric DEFAULT 5,
	"featured" boolean DEFAULT false,
	"is_demo_content" boolean DEFAULT true,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "faqs" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" varchar NOT NULL,
	"answer" jsonb NOT NULL,
	"category" varchar,
	"order" numeric DEFAULT 0 NOT NULL,
	"enabled" boolean DEFAULT true,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "inquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar NOT NULL,
	"email" varchar,
	"phone" varchar,
	"destination_id" integer,
	"inquiry_type" "enum_inquiries_inquiry_type" NOT NULL,
	"subject" varchar,
	"message" varchar NOT NULL,
	"source" varchar DEFAULT 'contact-page' NOT NULL,
	"status" "enum_inquiries_status" DEFAULT 'new' NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload_kv" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar NOT NULL,
	"data" jsonb NOT NULL
  );

  CREATE TABLE "payload_locked_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"global_slug" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload_locked_documents_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"users_id" integer,
	"media_id" integer,
	"markets_id" integer,
	"destinations_id" integer,
	"travel_programs_id" integer,
	"events_id" integer,
	"services_id" integer,
	"offers_id" integer,
	"guides_id" integer,
	"testimonials_id" integer,
	"faqs_id" integer,
	"inquiries_id" integer
  );

  CREATE TABLE "payload_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" jsonb,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload_preferences_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"users_id" integer
  );

  CREATE TABLE "payload_migrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"batch" numeric,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "site_settings_social_links" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"label" varchar NOT NULL,
	"url" varchar NOT NULL
  );

  CREATE TABLE "site_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_name" varchar DEFAULT 'LDC Travel' NOT NULL,
	"tagline" varchar DEFAULT 'Tourism Marketing' NOT NULL,
	"default_market_id" integer NOT NULL,
	"canonical_url" varchar,
	"contact_whatsapp_display" varchar DEFAULT '+966 7277981053' NOT NULL,
	"contact_whatsapp_number" varchar DEFAULT '9667277981053' NOT NULL,
	"contact_office" varchar DEFAULT '15 Mahmoud Essmat Hamdy, Sheraton' NOT NULL,
	"contact_reservations_email" varchar DEFAULT 'reservations@ldc-tourism.com' NOT NULL,
	"contact_sales_email" varchar DEFAULT 'sales@ldc-tourism.com' NOT NULL,
	"whatsapp_default_message" varchar DEFAULT 'Hi LDC Travel, I''d like to explore one of your destinations.',
	"whatsapp_context_template" varchar DEFAULT 'Hi LDC Travel, I''m interested in {{title}} and would like more information.',
	"footer_copy" varchar,
	"seo_meta_title" varchar,
	"seo_meta_description" varchar,
	"seo_social_image_id" integer,
	"seo_canonical_url" varchar,
	"updated_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE "homepage_why_ldc_items" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar NOT NULL,
	"icon" varchar NOT NULL
  );

  CREATE TABLE "homepage_inspiration_items" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"label" varchar NOT NULL,
	"description" varchar NOT NULL,
	"image_id" integer,
	"image_url" varchar
  );

  CREATE TABLE "homepage" (
	"id" serial PRIMARY KEY NOT NULL,
	"hero_eyebrow" varchar NOT NULL,
	"hero_headline" varchar NOT NULL,
	"hero_supporting_copy" varchar NOT NULL,
	"hero_image_id" integer,
	"hero_image_url" varchar,
	"hero_primary_cta_label" varchar NOT NULL,
	"hero_primary_cta_kind" "enum_homepage_hero_primary_cta_kind" DEFAULT 'whatsapp' NOT NULL,
	"hero_primary_cta_url" varchar,
	"hero_secondary_cta_label" varchar NOT NULL,
	"hero_secondary_cta_kind" "enum_homepage_hero_secondary_cta_kind" DEFAULT 'whatsapp' NOT NULL,
	"hero_secondary_cta_url" varchar,
	"why_ldc_eyebrow" varchar,
	"why_ldc_headline" varchar,
	"why_ldc_description" varchar,
	"inspiration_eyebrow" varchar,
	"inspiration_headline" varchar,
	"inspiration_description" varchar,
	"destination_cta_eyebrow" varchar,
	"destination_cta_headline" varchar,
	"destination_cta_description" varchar,
	"destination_cta_primary_cta_label" varchar NOT NULL,
	"destination_cta_primary_cta_kind" "enum_homepage_destination_cta_primary_cta_kind" DEFAULT 'whatsapp' NOT NULL,
	"destination_cta_primary_cta_url" varchar,
	"destination_cta_secondary_cta_label" varchar NOT NULL,
	"destination_cta_secondary_cta_kind" "enum_homepage_destination_cta_secondary_cta_kind" DEFAULT 'whatsapp' NOT NULL,
	"destination_cta_secondary_cta_url" varchar,
	"updated_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE "homepage_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"destinations_id" integer,
	"faqs_id" integer
  );

  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destinations_highlights" ADD CONSTRAINT "destinations_highlights_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "destinations_highlights" ADD CONSTRAINT "destinations_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destinations_experiences" ADD CONSTRAINT "destinations_experiences_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destinations_useful_information" ADD CONSTRAINT "destinations_useful_information_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destinations" ADD CONSTRAINT "destinations_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "destinations" ADD CONSTRAINT "destinations_seo_social_image_id_media_id_fk" FOREIGN KEY ("seo_social_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "destinations_rels" ADD CONSTRAINT "destinations_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destinations_rels" ADD CONSTRAINT "destinations_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destinations_rels" ADD CONSTRAINT "destinations_rels_markets_fk" FOREIGN KEY ("markets_id") REFERENCES "public"."markets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destinations_rels" ADD CONSTRAINT "destinations_rels_destinations_fk" FOREIGN KEY ("destinations_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destinations_rels" ADD CONSTRAINT "destinations_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destinations_rels" ADD CONSTRAINT "destinations_rels_travel_programs_fk" FOREIGN KEY ("travel_programs_id") REFERENCES "public"."travel_programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "travel_programs_itinerary" ADD CONSTRAINT "travel_programs_itinerary_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."travel_programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "travel_programs_highlights" ADD CONSTRAINT "travel_programs_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."travel_programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "travel_programs_included" ADD CONSTRAINT "travel_programs_included_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."travel_programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "travel_programs_not_included" ADD CONSTRAINT "travel_programs_not_included_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."travel_programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "travel_programs" ADD CONSTRAINT "travel_programs_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "travel_programs" ADD CONSTRAINT "travel_programs_offer_id_offers_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "travel_programs" ADD CONSTRAINT "travel_programs_seo_social_image_id_media_id_fk" FOREIGN KEY ("seo_social_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "travel_programs_rels" ADD CONSTRAINT "travel_programs_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."travel_programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "travel_programs_rels" ADD CONSTRAINT "travel_programs_rels_destinations_fk" FOREIGN KEY ("destinations_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "travel_programs_rels" ADD CONSTRAINT "travel_programs_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "travel_programs_rels" ADD CONSTRAINT "travel_programs_rels_markets_fk" FOREIGN KEY ("markets_id") REFERENCES "public"."markets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_destination_id_destinations_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_seo_social_image_id_media_id_fk" FOREIGN KEY ("seo_social_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_markets_fk" FOREIGN KEY ("markets_id") REFERENCES "public"."markets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_seo_social_image_id_media_id_fk" FOREIGN KEY ("seo_social_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_markets_fk" FOREIGN KEY ("markets_id") REFERENCES "public"."markets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offers" ADD CONSTRAINT "offers_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "offers" ADD CONSTRAINT "offers_program_id_travel_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."travel_programs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "offers" ADD CONSTRAINT "offers_seo_social_image_id_media_id_fk" FOREIGN KEY ("seo_social_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "offers_rels" ADD CONSTRAINT "offers_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offers_rels" ADD CONSTRAINT "offers_rels_markets_fk" FOREIGN KEY ("markets_id") REFERENCES "public"."markets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "guides" ADD CONSTRAINT "guides_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "guides" ADD CONSTRAINT "guides_seo_social_image_id_media_id_fk" FOREIGN KEY ("seo_social_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "guides_rels" ADD CONSTRAINT "guides_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "guides_rels" ADD CONSTRAINT "guides_rels_destinations_fk" FOREIGN KEY ("destinations_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "guides_rels" ADD CONSTRAINT "guides_rels_markets_fk" FOREIGN KEY ("markets_id") REFERENCES "public"."markets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_destination_id_destinations_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_markets_fk" FOREIGN KEY ("markets_id") REFERENCES "public"."markets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_destinations_fk" FOREIGN KEY ("destinations_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_travel_programs_fk" FOREIGN KEY ("travel_programs_id") REFERENCES "public"."travel_programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_offers_fk" FOREIGN KEY ("offers_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_guides_fk" FOREIGN KEY ("guides_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social_links" ADD CONSTRAINT "site_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_market_id_markets_id_fk" FOREIGN KEY ("default_market_id") REFERENCES "public"."markets"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_seo_social_image_id_media_id_fk" FOREIGN KEY ("seo_social_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_why_ldc_items" ADD CONSTRAINT "homepage_why_ldc_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_inspiration_items" ADD CONSTRAINT "homepage_inspiration_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_inspiration_items" ADD CONSTRAINT "homepage_inspiration_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_destinations_fk" FOREIGN KEY ("destinations_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE UNIQUE INDEX "markets_code_idx" ON "markets" USING btree ("code");
  CREATE INDEX "markets_updated_at_idx" ON "markets" USING btree ("updated_at");
  CREATE INDEX "markets_created_at_idx" ON "markets" USING btree ("created_at");
  CREATE INDEX "destinations_highlights_order_idx" ON "destinations_highlights" USING btree ("_order");
  CREATE INDEX "destinations_highlights_parent_id_idx" ON "destinations_highlights" USING btree ("_parent_id");
  CREATE INDEX "destinations_highlights_image_idx" ON "destinations_highlights" USING btree ("image_id");
  CREATE INDEX "destinations_experiences_order_idx" ON "destinations_experiences" USING btree ("_order");
  CREATE INDEX "destinations_experiences_parent_id_idx" ON "destinations_experiences" USING btree ("_parent_id");
  CREATE INDEX "destinations_useful_information_order_idx" ON "destinations_useful_information" USING btree ("_order");
  CREATE INDEX "destinations_useful_information_parent_id_idx" ON "destinations_useful_information" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "destinations_slug_idx" ON "destinations" USING btree ("slug");
  CREATE INDEX "destinations_cover_image_idx" ON "destinations" USING btree ("cover_image_id");
  CREATE INDEX "destinations_seo_seo_social_image_idx" ON "destinations" USING btree ("seo_social_image_id");
  CREATE INDEX "destinations_updated_at_idx" ON "destinations" USING btree ("updated_at");
  CREATE INDEX "destinations_created_at_idx" ON "destinations" USING btree ("created_at");
  CREATE INDEX "destinations_rels_order_idx" ON "destinations_rels" USING btree ("order");
  CREATE INDEX "destinations_rels_parent_idx" ON "destinations_rels" USING btree ("parent_id");
  CREATE INDEX "destinations_rels_path_idx" ON "destinations_rels" USING btree ("path");
  CREATE INDEX "destinations_rels_media_id_idx" ON "destinations_rels" USING btree ("media_id");
  CREATE INDEX "destinations_rels_markets_id_idx" ON "destinations_rels" USING btree ("markets_id");
  CREATE INDEX "destinations_rels_destinations_id_idx" ON "destinations_rels" USING btree ("destinations_id");
  CREATE INDEX "destinations_rels_faqs_id_idx" ON "destinations_rels" USING btree ("faqs_id");
  CREATE INDEX "destinations_rels_travel_programs_id_idx" ON "destinations_rels" USING btree ("travel_programs_id");
  CREATE INDEX "travel_programs_itinerary_order_idx" ON "travel_programs_itinerary" USING btree ("_order");
  CREATE INDEX "travel_programs_itinerary_parent_id_idx" ON "travel_programs_itinerary" USING btree ("_parent_id");
  CREATE INDEX "travel_programs_highlights_order_idx" ON "travel_programs_highlights" USING btree ("_order");
  CREATE INDEX "travel_programs_highlights_parent_id_idx" ON "travel_programs_highlights" USING btree ("_parent_id");
  CREATE INDEX "travel_programs_included_order_idx" ON "travel_programs_included" USING btree ("_order");
  CREATE INDEX "travel_programs_included_parent_id_idx" ON "travel_programs_included" USING btree ("_parent_id");
  CREATE INDEX "travel_programs_not_included_order_idx" ON "travel_programs_not_included" USING btree ("_order");
  CREATE INDEX "travel_programs_not_included_parent_id_idx" ON "travel_programs_not_included" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "travel_programs_slug_idx" ON "travel_programs" USING btree ("slug");
  CREATE INDEX "travel_programs_cover_image_idx" ON "travel_programs" USING btree ("cover_image_id");
  CREATE INDEX "travel_programs_offer_idx" ON "travel_programs" USING btree ("offer_id");
  CREATE INDEX "travel_programs_seo_seo_social_image_idx" ON "travel_programs" USING btree ("seo_social_image_id");
  CREATE INDEX "travel_programs_updated_at_idx" ON "travel_programs" USING btree ("updated_at");
  CREATE INDEX "travel_programs_created_at_idx" ON "travel_programs" USING btree ("created_at");
  CREATE INDEX "travel_programs_rels_order_idx" ON "travel_programs_rels" USING btree ("order");
  CREATE INDEX "travel_programs_rels_parent_idx" ON "travel_programs_rels" USING btree ("parent_id");
  CREATE INDEX "travel_programs_rels_path_idx" ON "travel_programs_rels" USING btree ("path");
  CREATE INDEX "travel_programs_rels_destinations_id_idx" ON "travel_programs_rels" USING btree ("destinations_id");
  CREATE INDEX "travel_programs_rels_media_id_idx" ON "travel_programs_rels" USING btree ("media_id");
  CREATE INDEX "travel_programs_rels_markets_id_idx" ON "travel_programs_rels" USING btree ("markets_id");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_destination_idx" ON "events" USING btree ("destination_id");
  CREATE INDEX "events_cover_image_idx" ON "events" USING btree ("cover_image_id");
  CREATE INDEX "events_seo_seo_social_image_idx" ON "events" USING btree ("seo_social_image_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "events_rels_order_idx" ON "events_rels" USING btree ("order");
  CREATE INDEX "events_rels_parent_idx" ON "events_rels" USING btree ("parent_id");
  CREATE INDEX "events_rels_path_idx" ON "events_rels" USING btree ("path");
  CREATE INDEX "events_rels_markets_id_idx" ON "events_rels" USING btree ("markets_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_cover_image_idx" ON "services" USING btree ("cover_image_id");
  CREATE INDEX "services_seo_seo_social_image_idx" ON "services" USING btree ("seo_social_image_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "services_rels_order_idx" ON "services_rels" USING btree ("order");
  CREATE INDEX "services_rels_parent_idx" ON "services_rels" USING btree ("parent_id");
  CREATE INDEX "services_rels_path_idx" ON "services_rels" USING btree ("path");
  CREATE INDEX "services_rels_markets_id_idx" ON "services_rels" USING btree ("markets_id");
  CREATE UNIQUE INDEX "offers_slug_idx" ON "offers" USING btree ("slug");
  CREATE INDEX "offers_image_idx" ON "offers" USING btree ("image_id");
  CREATE INDEX "offers_program_idx" ON "offers" USING btree ("program_id");
  CREATE INDEX "offers_seo_seo_social_image_idx" ON "offers" USING btree ("seo_social_image_id");
  CREATE INDEX "offers_updated_at_idx" ON "offers" USING btree ("updated_at");
  CREATE INDEX "offers_created_at_idx" ON "offers" USING btree ("created_at");
  CREATE INDEX "offers_rels_order_idx" ON "offers_rels" USING btree ("order");
  CREATE INDEX "offers_rels_parent_idx" ON "offers_rels" USING btree ("parent_id");
  CREATE INDEX "offers_rels_path_idx" ON "offers_rels" USING btree ("path");
  CREATE INDEX "offers_rels_markets_id_idx" ON "offers_rels" USING btree ("markets_id");
  CREATE UNIQUE INDEX "guides_slug_idx" ON "guides" USING btree ("slug");
  CREATE INDEX "guides_cover_image_idx" ON "guides" USING btree ("cover_image_id");
  CREATE INDEX "guides_seo_seo_social_image_idx" ON "guides" USING btree ("seo_social_image_id");
  CREATE INDEX "guides_updated_at_idx" ON "guides" USING btree ("updated_at");
  CREATE INDEX "guides_created_at_idx" ON "guides" USING btree ("created_at");
  CREATE INDEX "guides_rels_order_idx" ON "guides_rels" USING btree ("order");
  CREATE INDEX "guides_rels_parent_idx" ON "guides_rels" USING btree ("parent_id");
  CREATE INDEX "guides_rels_path_idx" ON "guides_rels" USING btree ("path");
  CREATE INDEX "guides_rels_destinations_id_idx" ON "guides_rels" USING btree ("destinations_id");
  CREATE INDEX "guides_rels_markets_id_idx" ON "guides_rels" USING btree ("markets_id");
  CREATE INDEX "testimonials_avatar_idx" ON "testimonials" USING btree ("avatar_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE INDEX "inquiries_destination_idx" ON "inquiries" USING btree ("destination_id");
  CREATE INDEX "inquiries_updated_at_idx" ON "inquiries" USING btree ("updated_at");
  CREATE INDEX "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_markets_id_idx" ON "payload_locked_documents_rels" USING btree ("markets_id");
  CREATE INDEX "payload_locked_documents_rels_destinations_id_idx" ON "payload_locked_documents_rels" USING btree ("destinations_id");
  CREATE INDEX "payload_locked_documents_rels_travel_programs_id_idx" ON "payload_locked_documents_rels" USING btree ("travel_programs_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_offers_id_idx" ON "payload_locked_documents_rels" USING btree ("offers_id");
  CREATE INDEX "payload_locked_documents_rels_guides_id_idx" ON "payload_locked_documents_rels" USING btree ("guides_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("inquiries_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_social_links_order_idx" ON "site_settings_social_links" USING btree ("_order");
  CREATE INDEX "site_settings_social_links_parent_id_idx" ON "site_settings_social_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_default_market_idx" ON "site_settings" USING btree ("default_market_id");
  CREATE INDEX "site_settings_seo_seo_social_image_idx" ON "site_settings" USING btree ("seo_social_image_id");
  CREATE INDEX "homepage_why_ldc_items_order_idx" ON "homepage_why_ldc_items" USING btree ("_order");
  CREATE INDEX "homepage_why_ldc_items_parent_id_idx" ON "homepage_why_ldc_items" USING btree ("_parent_id");
  CREATE INDEX "homepage_inspiration_items_order_idx" ON "homepage_inspiration_items" USING btree ("_order");
  CREATE INDEX "homepage_inspiration_items_parent_id_idx" ON "homepage_inspiration_items" USING btree ("_parent_id");
  CREATE INDEX "homepage_inspiration_items_image_idx" ON "homepage_inspiration_items" USING btree ("image_id");
  CREATE INDEX "homepage_hero_hero_image_idx" ON "homepage" USING btree ("hero_image_id");
  CREATE INDEX "homepage_rels_order_idx" ON "homepage_rels" USING btree ("order");
  CREATE INDEX "homepage_rels_parent_idx" ON "homepage_rels" USING btree ("parent_id");
  CREATE INDEX "homepage_rels_path_idx" ON "homepage_rels" USING btree ("path");
  CREATE INDEX "homepage_rels_destinations_id_idx" ON "homepage_rels" USING btree ("destinations_id");
  CREATE INDEX "homepage_rels_faqs_id_idx" ON "homepage_rels" USING btree ("faqs_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "markets" CASCADE;
  DROP TABLE "destinations_highlights" CASCADE;
  DROP TABLE "destinations_experiences" CASCADE;
  DROP TABLE "destinations_useful_information" CASCADE;
  DROP TABLE "destinations" CASCADE;
  DROP TABLE "destinations_rels" CASCADE;
  DROP TABLE "travel_programs_itinerary" CASCADE;
  DROP TABLE "travel_programs_highlights" CASCADE;
  DROP TABLE "travel_programs_included" CASCADE;
  DROP TABLE "travel_programs_not_included" CASCADE;
  DROP TABLE "travel_programs" CASCADE;
  DROP TABLE "travel_programs_rels" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "events_rels" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "services_rels" CASCADE;
  DROP TABLE "offers" CASCADE;
  DROP TABLE "offers_rels" CASCADE;
  DROP TABLE "guides" CASCADE;
  DROP TABLE "guides_rels" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "inquiries" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_social_links" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "homepage_why_ldc_items" CASCADE;
  DROP TABLE "homepage_inspiration_items" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TABLE "homepage_rels" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_destinations_status";
  DROP TYPE "public"."enum_travel_programs_starting_price_unit";
  DROP TYPE "public"."enum_travel_programs_status";
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum_services_status";
  DROP TYPE "public"."enum_offers_status";
  DROP TYPE "public"."enum_guides_category";
  DROP TYPE "public"."enum_guides_status";
  DROP TYPE "public"."enum_inquiries_inquiry_type";
  DROP TYPE "public"."enum_inquiries_status";
  DROP TYPE "public"."enum_homepage_hero_primary_cta_kind";
  DROP TYPE "public"."enum_homepage_hero_secondary_cta_kind";
  DROP TYPE "public"."enum_homepage_destination_cta_primary_cta_kind";
  DROP TYPE "public"."enum_homepage_destination_cta_secondary_cta_kind";`)
}
