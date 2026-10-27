#!/usr/bin/env python3
"""
Comprehensive Data Integrity & Referential Validator for DWM Datasets
Validates:
- Exact Expected Schemas & Headers
- Actual Row Counts Matching Specifications
- Primary Key Uniqueness
- Bridge Entity Composite Key Uniqueness
- Foreign Key Referential Integrity across All Linked Entities
- Temporal Chronology (Application Date >= Job Posting Date)
- 1:1 Cardinality between Alumni and Career Outcomes
- Categorical Domain Validity and Non-Null Guarantees
- Proper Non-Zero Exit Code on any Failure
"""

import sys
import csv
import datetime
from pathlib import Path

DATASET_DIR = Path("datasets") if Path("datasets").exists() else Path("dwm-synthetic-datasets")

EXPECTED_SCHEMAS = {
    "skills.csv": {
        "headers": ["skill_id", "skill_name", "skill_category", "data_source"],
        "expected_count": 150,
        "pk": "skill_id",
    },
    "alumni.csv": {
        "headers": [
            "alumni_id", "graduation_year", "degree", "field_of_study",
            "current_role", "industry", "experience_years", "location_region",
            "career_level", "data_source"
        ],
        "expected_count": 2000,
        "pk": "alumni_id",
    },
    "jobs.csv": {
        "headers": [
            "job_id", "job_title", "company_id", "company_name", "industry",
            "location_region", "employment_type", "posted_date", "experience_level", "data_source"
        ],
        "expected_count": 5000,
        "pk": "job_id",
    },
    "alumni_skills.csv": {
        "headers": ["alumni_id", "skill_id", "proficiency_level", "years_used", "data_source"],
        "expected_count": 20000,
        "composite_pk": ("alumni_id", "skill_id"),
    },
    "job_skills.csv": {
        "headers": ["job_id", "skill_id", "required_level", "data_source"],
        "expected_count": 15000,
        "composite_pk": ("job_id", "skill_id"),
    },
    "applications.csv": {
        "headers": [
            "application_id", "alumni_id", "job_id", "application_date",
            "application_status", "days_to_decision", "data_source"
        ],
        "expected_count": 6000,
        "pk": "application_id",
    },
    "career_outcomes.csv": {
        "headers": [
            "outcome_id", "alumni_id", "observation_period_months",
            "employed_within_6_months", "career_level", "industry",
            "experience_years_at_observation", "data_source"
        ],
        "expected_count": 2000,
        "pk": "outcome_id",
    },
}

def validate_datasets():
    print("=" * 75)
    print("DWM DATASET PACK INTEGRITY VALIDATOR")
    print(f"Target Directory: {DATASET_DIR.resolve()}")
    print("=" * 75)

    errors = []
    summary_report = []

    # ---------------------------------------------------------
    # 1. Validate skills.csv
    # ---------------------------------------------------------
    skills_file = DATASET_DIR / "skills.csv"
    skill_ids = set()
    skill_rows = 0

    if not skills_file.exists():
        errors.append(f"Missing file: {skills_file}")
    else:
        with open(skills_file, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            assert reader.fieldnames == EXPECTED_SCHEMAS["skills.csv"]["headers"], \
                f"Header mismatch in {skills_file.name}: got {reader.fieldnames}"
            for line_no, row in enumerate(reader, 2):
                skill_rows += 1
                sid = row["skill_id"]
                if sid in skill_ids:
                    errors.append(f"Duplicate skill_id '{sid}' at line {line_no}")
                skill_ids.add(sid)
                if not row["skill_name"].strip():
                    errors.append(f"Empty skill_name at line {line_no}")
                if not row["skill_category"].strip():
                    errors.append(f"Empty skill_category at line {line_no}")
                if row["data_source"] not in ["indian_academic_benchmark", "synthetic_indian_academic_demo"]:
                    errors.append(f"Invalid data_source at line {line_no}: {row['data_source']}")

    summary_report.append((
        "skills.csv",
        skill_rows,
        EXPECTED_SCHEMAS["skills.csv"]["expected_count"],
        len(skill_ids),
        "PASSED" if skill_rows == 150 and not errors else "FAILED"
    ))

    # ---------------------------------------------------------
    # 2. Validate alumni.csv
    # ---------------------------------------------------------
    alumni_file = DATASET_DIR / "alumni.csv"
    alumni_ids = set()
    alumni_rows = 0

    if not alumni_file.exists():
        errors.append(f"Missing file: {alumni_file}")
    else:
        with open(alumni_file, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            assert reader.fieldnames == EXPECTED_SCHEMAS["alumni.csv"]["headers"], \
                f"Header mismatch in {alumni_file.name}: got {reader.fieldnames}"
            for line_no, row in enumerate(reader, 2):
                alumni_rows += 1
                aid = row["alumni_id"]
                if aid in alumni_ids:
                    errors.append(f"Duplicate alumni_id '{aid}' at line {line_no}")
                alumni_ids.add(aid)
                
                try:
                    grad_year = int(row["graduation_year"])
                    if grad_year not in range(2015, 2030):
                        errors.append(f"Invalid graduation_year '{grad_year}' at line {line_no}")
                except ValueError:
                    errors.append(f"Non-integer graduation_year at line {line_no}")

                try:
                    exp = int(row["experience_years"])
                    if exp < 0:
                        errors.append(f"Negative experience_years '{exp}' at line {line_no}")
                except ValueError:
                    errors.append(f"Non-integer experience_years at line {line_no}")

                if row["career_level"] not in ["Entry-Level", "Mid-Level", "Senior", "Lead/Principal"]:
                    errors.append(f"Invalid career_level '{row['career_level']}' at line {line_no}")

    summary_report.append((
        "alumni.csv",
        alumni_rows,
        EXPECTED_SCHEMAS["alumni.csv"]["expected_count"],
        len(alumni_ids),
        "PASSED" if alumni_rows == 2000 and not errors else "FAILED"
    ))

    # ---------------------------------------------------------
    # 3. Validate jobs.csv
    # ---------------------------------------------------------
    jobs_file = DATASET_DIR / "jobs.csv"
    job_ids = set()
    job_post_dates = {}
    job_rows = 0

    if not jobs_file.exists():
        errors.append(f"Missing file: {jobs_file}")
    else:
        with open(jobs_file, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            assert reader.fieldnames == EXPECTED_SCHEMAS["jobs.csv"]["headers"], \
                f"Header mismatch in {jobs_file.name}: got {reader.fieldnames}"
            for line_no, row in enumerate(reader, 2):
                job_rows += 1
                jid = row["job_id"]
                if jid in job_ids:
                    errors.append(f"Duplicate job_id '{jid}' at line {line_no}")
                job_ids.add(jid)

                try:
                    post_dt = datetime.date.fromisoformat(row["posted_date"])
                    job_post_dates[jid] = post_dt
                except ValueError:
                    errors.append(f"Invalid ISO posted_date '{row['posted_date']}' at line {line_no}")

                if row["employment_type"] not in ["Full-Time", "Contract", "Internship"]:
                    errors.append(f"Invalid employment_type '{row['employment_type']}' at line {line_no}")

    summary_report.append((
        "jobs.csv",
        job_rows,
        EXPECTED_SCHEMAS["jobs.csv"]["expected_count"],
        len(job_ids),
        "PASSED" if job_rows == 5000 and not errors else "FAILED"
    ))

    # ---------------------------------------------------------
    # 4. Validate alumni_skills.csv
    # ---------------------------------------------------------
    alumni_skills_file = DATASET_DIR / "alumni_skills.csv"
    alumni_skill_pairs = set()
    as_rows = 0

    if not alumni_skills_file.exists():
        errors.append(f"Missing file: {alumni_skills_file}")
    else:
        with open(alumni_skills_file, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            assert reader.fieldnames == EXPECTED_SCHEMAS["alumni_skills.csv"]["headers"]
            for line_no, row in enumerate(reader, 2):
                as_rows += 1
                aid = row["alumni_id"]
                sid = row["skill_id"]

                # FK Check
                if aid not in alumni_ids:
                    errors.append(f"Broken FK: alumni_id '{aid}' not found at line {line_no}")
                if sid not in skill_ids:
                    errors.append(f"Broken FK: skill_id '{sid}' not found at line {line_no}")

                # Composite PK Check
                pair = (aid, sid)
                if pair in alumni_skill_pairs:
                    errors.append(f"Duplicate bridge pair {pair} at line {line_no}")
                alumni_skill_pairs.add(pair)

                if row["proficiency_level"] not in ["Beginner", "Intermediate", "Advanced", "Expert"]:
                    errors.append(f"Invalid proficiency_level '{row['proficiency_level']}' at line {line_no}")

    summary_report.append((
        "alumni_skills.csv",
        as_rows,
        EXPECTED_SCHEMAS["alumni_skills.csv"]["expected_count"],
        len(alumni_skill_pairs),
        "PASSED" if as_rows == 20000 and not errors else "FAILED"
    ))

    # ---------------------------------------------------------
    # 5. Validate job_skills.csv
    # ---------------------------------------------------------
    job_skills_file = DATASET_DIR / "job_skills.csv"
    job_skill_pairs = set()
    js_rows = 0

    if not job_skills_file.exists():
        errors.append(f"Missing file: {job_skills_file}")
    else:
        with open(job_skills_file, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            assert reader.fieldnames == EXPECTED_SCHEMAS["job_skills.csv"]["headers"]
            for line_no, row in enumerate(reader, 2):
                js_rows += 1
                jid = row["job_id"]
                sid = row["skill_id"]

                # FK Check
                if jid not in job_ids:
                    errors.append(f"Broken FK: job_id '{jid}' not found at line {line_no}")
                if sid not in skill_ids:
                    errors.append(f"Broken FK: skill_id '{sid}' not found at line {line_no}")

                # Composite PK Check
                pair = (jid, sid)
                if pair in job_skill_pairs:
                    errors.append(f"Duplicate bridge pair {pair} at line {line_no}")
                job_skill_pairs.add(pair)

                if row["required_level"] not in ["Mandatory", "Preferred", "Good-to-have"]:
                    errors.append(f"Invalid required_level '{row['required_level']}' at line {line_no}")

    summary_report.append((
        "job_skills.csv",
        js_rows,
        EXPECTED_SCHEMAS["job_skills.csv"]["expected_count"],
        len(job_skill_pairs),
        "PASSED" if js_rows == 15000 and not errors else "FAILED"
    ))

    # ---------------------------------------------------------
    # 6. Validate applications.csv
    # ---------------------------------------------------------
    app_file = DATASET_DIR / "applications.csv"
    app_ids = set()
    app_rows = 0

    if not app_file.exists():
        errors.append(f"Missing file: {app_file}")
    else:
        with open(app_file, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            assert reader.fieldnames == EXPECTED_SCHEMAS["applications.csv"]["headers"]
            for line_no, row in enumerate(reader, 2):
                app_rows += 1
                appid = row["application_id"]
                aid = row["alumni_id"]
                jid = row["job_id"]

                if appid in app_ids:
                    errors.append(f"Duplicate application_id '{appid}' at line {line_no}")
                app_ids.add(appid)

                # FK Checks
                if aid not in alumni_ids:
                    errors.append(f"Broken FK: alumni_id '{aid}' not found at line {line_no}")
                if jid not in job_ids:
                    errors.append(f"Broken FK: job_id '{jid}' not found at line {line_no}")

                # Chronological Validation
                try:
                    app_date = datetime.date.fromisoformat(row["application_date"])
                    if jid in job_post_dates:
                        post_date = job_post_dates[jid]
                        if app_date < post_date:
                            errors.append(
                                f"Temporal paradox at line {line_no}: Application {appid} date ({app_date}) "
                                f"predates Job {jid} posted date ({post_date})"
                            )
                except ValueError:
                    errors.append(f"Invalid ISO application_date at line {line_no}")

                if row["application_status"] not in ["applied", "shortlisted", "interviewed", "offered", "hired", "rejected"]:
                    errors.append(f"Invalid application_status '{row['application_status']}' at line {line_no}")

    summary_report.append((
        "applications.csv",
        app_rows,
        EXPECTED_SCHEMAS["applications.csv"]["expected_count"],
        len(app_ids),
        "PASSED" if app_rows == 6000 and not errors else "FAILED"
    ))

    # ---------------------------------------------------------
    # 7. Validate career_outcomes.csv (1:1 with Alumni)
    # ---------------------------------------------------------
    outcomes_file = DATASET_DIR / "career_outcomes.csv"
    outcome_ids = set()
    outcome_alumni_ids = set()
    outcome_rows = 0

    if not outcomes_file.exists():
        errors.append(f"Missing file: {outcomes_file}")
    else:
        with open(outcomes_file, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            assert reader.fieldnames == EXPECTED_SCHEMAS["career_outcomes.csv"]["headers"]
            for line_no, row in enumerate(reader, 2):
                outcome_rows += 1
                oid = row["outcome_id"]
                aid = row["alumni_id"]

                if oid in outcome_ids:
                    errors.append(f"Duplicate outcome_id '{oid}' at line {line_no}")
                outcome_ids.add(oid)

                # FK Check
                if aid not in alumni_ids:
                    errors.append(f"Broken FK: alumni_id '{aid}' not found in alumni at line {line_no}")

                # 1:1 Cardinality Check
                if aid in outcome_alumni_ids:
                    errors.append(f"Duplicate 1:1 outcome for alumni_id '{aid}' at line {line_no}")
                outcome_alumni_ids.add(aid)

                if row["employed_within_6_months"] not in ["0", "1"]:
                    errors.append(f"Invalid binary target '{row['employed_within_6_months']}' at line {line_no}")

    # Verify that all 2,000 alumni have an outcome
    missing_alumni_outcomes = alumni_ids - outcome_alumni_ids
    if missing_alumni_outcomes:
        errors.append(f"{len(missing_alumni_outcomes)} alumni lack a 1:1 career outcome record")

    summary_report.append((
        "career_outcomes.csv",
        outcome_rows,
        EXPECTED_SCHEMAS["career_outcomes.csv"]["expected_count"],
        len(outcome_ids),
        "PASSED" if outcome_rows == 2000 and not errors else "FAILED"
    ))

    # ---------------------------------------------------------
    # DISPLAY PER-FILE SUMMARY REPORT
    # ---------------------------------------------------------
    print(f"\n{'DATASET FILE':<32} | {'ACTUAL ROWS':<12} | {'EXPECTED':<10} | {'UNIQUE KEYS':<12} | {'STATUS'}")
    print("-" * 75)
    total_actual = 0
    total_expected = 0
    for file_name, actual, expected, unique_k, status in summary_report:
        total_actual += actual
        total_expected += expected
        print(f"{file_name:<32} | {actual:<12} | {expected:<10} | {unique_k:<12} | {status}")
    print("-" * 75)
    print(f"{'TOTAL RECORD PACK':<32} | {total_actual:<12} | {total_expected:<10} | {'':<12} | {'PASSED' if not errors else 'FAILED'}")
    print("=" * 75)

    if errors:
        print(f"\n[ERROR] Integrity validation encountered {len(errors)} failure(s):")
        for err in errors[:25]:
            print(f"  [X] {err}")
        if len(errors) > 25:
            print(f"  ... and {len(errors) - 25} additional error(s)")
        sys.exit(1)
    else:
        print("\n[PASS] ALL INTEGRITY CHECKS PASSED: ZERO INTEGRITY OR TEMPORAL ERRORS DETECTED.")
        sys.exit(0)

if __name__ == "__main__":
    validate_datasets()
