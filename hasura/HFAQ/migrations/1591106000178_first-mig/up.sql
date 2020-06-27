CREATE TYPE public.subscription_contact_type_enum AS ENUM (
    'EMAIL'
);
CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;
CREATE TABLE public.answer (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    content text NOT NULL,
    question_id uuid NOT NULL,
    author character varying NOT NULL,
    published boolean DEFAULT false NOT NULL
);
CREATE TABLE public.notifications_chat (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    chat_id character varying NOT NULL,
    is_admin boolean NOT NULL
);
CREATE TABLE public.question (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    content text NOT NULL,
    additional jsonb,
    meta jsonb,
    creator character varying
);
ALTER TABLE ONLY public.answer
    ADD CONSTRAINT answer_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.notifications_chat
    ADD CONSTRAINT notifications_chats_chat_id_key UNIQUE (chat_id);
ALTER TABLE ONLY public.notifications_chat
    ADD CONSTRAINT notifications_chats_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.question
    ADD CONSTRAINT question_pkey PRIMARY KEY (id);
CREATE TRIGGER set_public_answer_updated_at BEFORE UPDATE ON public.answer FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_answer_updated_at ON public.answer IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_notifications_chats_updated_at BEFORE UPDATE ON public.notifications_chat FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_notifications_chats_updated_at ON public.notifications_chat IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_question_updated_at BEFORE UPDATE ON public.question FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_question_updated_at ON public.question IS 'trigger to set value of column "updated_at" to current timestamp on row update';
ALTER TABLE ONLY public.answer
    ADD CONSTRAINT answer_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.question(id) ON DELETE RESTRICT;
