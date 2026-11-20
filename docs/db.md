-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.produk (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  nama character varying NOT NULL,
  sku character varying NOT NULL UNIQUE,
  modal integer NOT NULL DEFAULT 0,
  harga_jual integer NOT NULL DEFAULT 0,
  stok integer NOT NULL DEFAULT 0,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT produk_pkey PRIMARY KEY (id)
);
CREATE TABLE public.chat_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying NOT NULL DEFAULT 'Sesi Chat Baru'::character varying,
  platform USER-DEFINED NOT NULL DEFAULT 'shopee'::chat_platform,
  priority USER-DEFINED NOT NULL DEFAULT 'medium'::chat_priority,
  status USER-DEFINED NOT NULL DEFAULT 'active'::chat_status,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT chat_sessions_pkey PRIMARY KEY (id)
);
CREATE TABLE public.chat_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL,
  sender USER-DEFINED NOT NULL,
  message_text text NOT NULL,
  detected_intent character varying,
  confidence_score numeric,
  extracted_entities jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT chat_messages_pkey PRIMARY KEY (id),
  CONSTRAINT chat_messages_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.chat_sessions(id)
);