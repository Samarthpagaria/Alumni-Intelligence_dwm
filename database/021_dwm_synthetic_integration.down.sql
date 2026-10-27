-- 021_dwm_synthetic_integration.down.sql
-- Reverts synthetic DWM integration structures cleanly with schema guard

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'dwh') THEN
        DROP TABLE IF EXISTS dwh.fact_career_outcomes CASCADE;
        DROP TABLE IF EXISTS dwh.bridge_job_skill CASCADE;
        DROP TABLE IF EXISTS dwh.bridge_alumni_skill CASCADE;
        DROP TABLE IF EXISTS dwh.dim_job CASCADE;

        DROP INDEX IF EXISTS dwh.uq_dwh_fact_app_alumni_grain;
        DROP INDEX IF EXISTS dwh.uq_dwh_fact_app_natural;
        
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'dwh' AND table_name = 'fact_job_application') THEN
            ALTER TABLE dwh.fact_job_application DROP COLUMN IF EXISTS application_status;
            ALTER TABLE dwh.fact_job_application DROP COLUMN IF EXISTS natural_application_id;
            ALTER TABLE dwh.fact_job_application DROP COLUMN IF EXISTS job_sk;
            ALTER TABLE dwh.fact_job_application DROP COLUMN IF EXISTS alumni_sk;
        END IF;

        DROP INDEX IF EXISTS dwh.uq_dwh_dim_company_natural;
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'dwh' AND table_name = 'dim_company') THEN
            ALTER TABLE dwh.dim_company DROP COLUMN IF EXISTS record_source;
            ALTER TABLE dwh.dim_company DROP COLUMN IF EXISTS natural_company_id;
        END IF;

        DROP INDEX IF EXISTS dwh.uq_dwh_dim_alumni_natural;
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'dwh' AND table_name = 'dim_alumni') THEN
            ALTER TABLE dwh.dim_alumni DROP COLUMN IF EXISTS career_level;
            ALTER TABLE dwh.dim_alumni DROP COLUMN IF EXISTS degree;
            ALTER TABLE dwh.dim_alumni DROP COLUMN IF EXISTS natural_alumni_id;
        END IF;

        DROP INDEX IF EXISTS dwh.uq_dwh_dim_skill_natural;
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'dwh' AND table_name = 'dim_skill') THEN
            ALTER TABLE dwh.dim_skill DROP COLUMN IF EXISTS record_source;
            ALTER TABLE dwh.dim_skill DROP COLUMN IF EXISTS natural_skill_id;
        END IF;
    END IF;
END $$;
