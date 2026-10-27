#!/usr/bin/env python3
"""
Alumni Intelligence and Career Analytics Platform (Indian Tech Context)
Deterministic Synthetic DWM Dataset Generator (~50,150 total records)
Generates 7 relationally linked CSV datasets in datasets/
"""

import os
import csv
import random
import datetime
from pathlib import Path

# Fix seed for strict deterministic reproducibility
RANDOM_SEED = 2026
random.seed(RANDOM_SEED)

OUTPUT_DIR = Path("datasets") if Path("datasets").exists() else Path("dwm-synthetic-datasets")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
DATA_SOURCE_TAG = "indian_academic_benchmark"

# Exact Row Allocations (Total = 50,150 rows)
N_ALUMNI = 2000
N_SKILLS = 150
N_ALUMNI_SKILLS = 20000    # ~10 skills per alumni (Rich support for Apriori / K-Means)
N_JOBS = 5000              # Distributed across Indian tech hubs
N_JOB_SKILLS = 15000       # 3 skills per job opening
N_APPLICATIONS = 6000      # Application recruitment funnel
N_OUTCOMES = 2000          # 1:1 with alumni for classification

# Indian Academic Context Catalogs
DEGREES = [
    ("B.Tech Computer Science and Engineering", "Computer Science"),
    ("B.Tech Information Technology", "Information Technology"),
    ("B.Tech Electronics & Communication", "Electronics"),
    ("B.Tech Artificial Intelligence & Data Science", "Data Science"),
    ("BCA (Bachelor of Computer Applications)", "Computer Applications"),
    ("MCA (Master of Computer Applications)", "Computer Applications"),
    ("M.Tech Software Engineering", "Computer Science"),
    ("M.Tech Data Analytics", "Data Science"),
    ("B.E. Electrical & Electronics", "Electrical Engineering"),
    ("B.Sc Computer Science", "Computer Science")
]

INDUSTRIES = [
    "Information Technology & SaaS",
    "Banking & FinTech (BFSI)",
    "Healthcare & HealthTech",
    "E-Commerce & Quick Commerce",
    "Telecommunications & 5G",
    "Automotive & EV Systems",
    "EdTech & Digital Learning",
    "Consulting & IT Services"
]

INDIAN_LOCATIONS = [
    "Bengaluru (Karnataka)",
    "Hyderabad (Telangana)",
    "Pune (Maharashtra)",
    "Mumbai (Maharashtra)",
    "Delhi NCR (Gurugram / Noida)",
    "Chennai (Tamil Nadu)",
    "Kolkata (West Bengal)",
    "Ahmedabad (Gujarat)",
    "Kochi (Kerala)",
    "Remote - India"
]

# Explicitly Fictitious Indian Corporate Entities (to avoid trademark confusion)
FICTIONAL_INDIAN_COMPANIES = [
    (f"IND-COMP-{i:03d}", name, ind) for i, (name, ind) in enumerate([
        ("VistaraGrid Technologies Pvt Ltd", "Consulting & IT Services"),
        ("Kavach CyberSec Systems", "Information Technology & SaaS"),
        ("Dravida CloudWorks Labs", "Information Technology & SaaS"),
        ("Sahyadri Data Infotech", "Consulting & IT Services"),
        ("AryaNet Telecommunications", "Telecommunications & 5G"),
        ("Pinnacle Bharat PayTech", "Banking & FinTech (BFSI)"),
        ("MahaLogistics HyperDelivery", "E-Commerce & Quick Commerce"),
        ("IndusScale Enterprise Software", "Information Technology & SaaS"),
        ("Navik Mobility & EV Platforms", "Automotive & EV Systems"),
        ("Sanjeevani Digital HealthCare", "Healthcare & HealthTech"),
        ("RupyaCore Digital Settlements", "Banking & FinTech (BFSI)"),
        ("Bhavishya EdTech Solutions", "EdTech & Digital Learning"),
        ("Dakshin MicroCommerce", "E-Commerce & Quick Commerce"),
        ("Ganga Valley Software Labs", "Consulting & IT Services"),
        ("Utkarsh Financial Grid", "Banking & FinTech (BFSI)"),
        ("Tejas Quantum Network Pvt Ltd", "Telecommunications & 5G"),
        ("ArogyaStream Health Intelligence", "Healthcare & HealthTech"),
        ("GatiFast Urban Cargo", "E-Commerce & Quick Commerce"),
        ("Chakra Automations & Robotics", "Automotive & EV Systems"),
        ("Samudra Analytics Pvt Ltd", "Information Technology & SaaS"),
        ("Vanguard Indic InfoTech", "Consulting & IT Services"),
        ("Kaveri Cloud Infrastructure", "Information Technology & SaaS"),
        ("ShikshaPlus Interactive Learning", "EdTech & Digital Learning"),
        ("Vayu Mobility Dynamics", "Automotive & EV Systems"),
        ("Himachal HighTech Services", "Consulting & IT Services")
    ], 1)
]

ROLES_BY_DOMAIN = {
    "Engineering": [
        "Software Development Engineer I", "Software Development Engineer II", 
        "Senior Software Engineer", "Backend Developer", "Frontend Developer", 
        "Full Stack Web Developer", "DevOps Engineer", "Site Reliability Engineer", 
        "Cloud Platform Engineer", "Systems Architect"
    ],
    "Data": [
        "Junior Data Analyst", "Senior Data Analyst", "Data Engineer", 
        "Big Data Specialist", "Business Intelligence Developer", "Data Scientist", 
        "Machine Learning Engineer", "AI Research Associate", "Database Administrator"
    ],
    "Security": [
        "Information Security Analyst", "Cybersecurity Specialist", "SOC Engineer", 
        "Penetration Tester", "Cloud Security Consultant"
    ],
    "Product_Biz": [
        "Associate Product Manager", "Technical Product Manager", "Scrum Master", 
        "Business Analyst", "IT Project Consultant"
    ],
    "Design": [
        "UI/UX Designer", "Product Experience Designer", "Design Systems Engineer"
    ]
}

ALL_ROLES = [r for group in ROLES_BY_DOMAIN.values() for r in group]

# 150 Normalized Skills
SKILL_CATALOG_RAW = {
    "Programming Languages": [
        "Python", "Java", "C++", "C#", "JavaScript", "TypeScript", "Go", "Rust", 
        "Kotlin", "Swift", "Scala", "R", "PHP", "SQL", "Bash/Shell Scripting", "Solidity"
    ],
    "Data Engineering & Warehousing": [
        "PostgreSQL", "MySQL", "MongoDB", "Redis", "Apache Spark", "Apache Kafka", 
        "Apache Airflow", "Hadoop", "Snowflake", "Databricks", "dbt", "Google BigQuery", 
        "Amazon Redshift", "Cassandra", "Elasticsearch", "ETL Pipeline Design", 
        "Data Modeling", "Star Schema Design", "Presto / Trino", "Airbyte", "ClickHouse"
    ],
    "Business Intelligence & Analytics": [
        "Tableau", "Power BI", "Microsoft Excel / Advanced DAX", "Looker", "Metabase", 
        "Statistical Modeling", "Exploratory Data Analysis", "A/B Testing Methodology", 
        "Google Analytics", "Cohort Analysis", "Predictive Analytics"
    ],
    "Machine Learning & AI": [
        "Scikit-Learn", "Pandas", "NumPy", "TensorFlow", "PyTorch", "Keras", 
        "Natural Language Processing", "Computer Vision (OpenCV)", "Large Language Models", 
        "LangChain", "Vector Databases (Pinecone/Milvus)", "MLflow", "Feature Engineering", 
        "XGBoost", "Deep Learning", "Hugging Face Transformers"
    ],
    "Cloud & Infrastructure": [
        "Amazon Web Services (AWS)", "Microsoft Azure", "Google Cloud Platform (GCP)", 
        "Docker Containerization", "Kubernetes", "Terraform", "Ansible", "CI/CD (Jenkins)", 
        "GitHub Actions", "Linux System Administration", "Prometheus", "Grafana", 
        "Nginx", "Microservices Architecture", "Serverless Computing", "Helm Charts"
    ],
    "Web & Backend Frameworks": [
        "React.js", "Node.js", "Express.js", "Next.js", "Angular", "Vue.js", "Django", 
        "FastAPI", "Flask", "Spring Boot", "ASP.NET Core", "GraphQL", "RESTful Web Services", 
        "HTML5 / CSS3", "Tailwind CSS", "Redux Toolkit", "WebSockets"
    ],
    "Cybersecurity & Networks": [
        "Network Security", "Vulnerability Assessment", "Penetration Testing", "SIEM Tools", 
        "Identity and Access Management (IAM)", "OWASP Top 10", "Wireshark", "Firewall Configuration", 
        "Cryptography Basics", "SOC Operations", "Zero Trust Architecture", "ISO 27001 Compliance"
    ],
    "Product Management & Agile": [
        "Agile Methodology", "Scrum Framework", "Jira Software", "Confluence Documentation", 
        "Product Roadmapping", "User Story Mapping", "Stakeholder Communication", 
        "Business Requirements Documentation (BRD)", "Risk Assessment", "Sprint Planning"
    ],
    "UI/UX & Design": [
        "Figma", "Adobe XD", "Wireframing", "Interactive Prototyping", "User Research", 
        "Usability Testing", "Design Systems", "Information Architecture"
    ],
    "Core Professional & Management": [
        "Technical Documentation", "Cross-Functional Leadership", "Problem Solving", 
        "Client Presentations", "Team Mentorship", "Vendor Management", "Root Cause Analysis"
    ]
}

def generate_skills_master():
    skills = []
    s_id = 1
    for cat, items in SKILL_CATALOG_RAW.items():
        for item in items:
            skills.append((f"SKILL-{s_id:03d}", item, cat))
            s_id += 1
    # Specialized supplementary topics to reach exactly 150
    supplementary = [
        "Apache Flink", "ArgoCD", "Vault Security", "ChromaDB", "Apollo GraphQL", 
        "RabbitMQ", "Celery Distributed Task", "Istio Service Mesh", "Datadog APM", 
        "New Relic", "Splunk Log Analytics", "Kong API Gateway", "CockroachDB", 
        "OpenTelemetry", "PySpark Distributed", "Great Expectations QA", "Delta Lake"
    ]
    for supp in supplementary:
        if len(skills) >= N_SKILLS:
            break
        skills.append((f"SKILL-{s_id:03d}", supp, "Specialized Tech"))
        s_id += 1
    return skills[:N_SKILLS]

SKILLS_LIST = generate_skills_master()
SKILL_BY_ID = {s[0]: s for s in SKILLS_LIST}
SKILL_IDS = [s[0] for s in SKILLS_LIST]

# Skill association buckets for realistic co-occurrence (Crucial for Apriori)
PYTHON_DATA_PACK = [s[0] for s in SKILLS_LIST if s[1] in ["Python", "SQL", "Pandas", "NumPy", "Scikit-Learn", "Tableau", "Power BI"]]
FULLSTACK_JS_PACK = [s[0] for s in SKILLS_LIST if s[1] in ["JavaScript", "TypeScript", "React.js", "Node.js", "Express.js", "MongoDB", "HTML5 / CSS3"]]
CLOUD_DEVOPS_PACK = [s[0] for s in SKILLS_LIST if s[1] in ["Docker Containerization", "Kubernetes", "Terraform", "Amazon Web Services (AWS)", "Linux System Administration", "CI/CD (Jenkins)"]]
JAVA_ENTERPRISE_PACK = [s[0] for s in SKILLS_LIST if s[1] in ["Java", "Spring Boot", "MySQL", "PostgreSQL", "Microservices Architecture", "RESTful Web Services"]]

def random_date(start_year=2022, end_year=2026):
    start = datetime.date(start_year, 1, 1)
    end = datetime.date(end_year, 6, 30)
    delta_days = (end - start).days
    return start + datetime.timedelta(days=random.randint(0, delta_days))

def main():
    print("=" * 70)
    print("GENERATING SYNTHETIC INDIAN DWM DATASET PACK (~50,150 RECORDS)")
    print("=" * 70)

    # 1. skills.csv (150 rows)
    skills_path = OUTPUT_DIR / "skills.csv"
    with open(skills_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["skill_id", "skill_name", "skill_category", "data_source"])
        for sid, name, cat in SKILLS_LIST:
            writer.writerow([sid, name, cat, DATA_SOURCE_TAG])
    print(f"[1/7] Generated {skills_path} ({len(SKILLS_LIST)} records)")

    # 2. alumni.csv (2,000 rows)
    alumni_records = []
    alumni_path = OUTPUT_DIR / "alumni.csv"
    with open(alumni_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "alumni_id", "graduation_year", "degree", "field_of_study", 
            "current_role", "industry", "experience_years", "location_region", 
            "career_level", "data_source"
        ])
        for i in range(1, N_ALUMNI + 1):
            aid = f"IND-ALUM-{i:06d}"
            grad_year = random.choices([2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025], weights=[8, 10, 12, 18, 20, 16, 12, 4])[0]
            deg, field = random.choice(DEGREES)
            base_exp = 2026 - grad_year
            exp = max(0, int(random.gauss(base_exp, 0.8)))
            
            if exp <= 1:
                level = "Entry-Level"
                role = random.choice(["Junior Data Analyst", "Software Development Engineer I", "Associate Product Manager", "SOC Engineer", "UI/UX Designer"])
            elif exp <= 4:
                level = "Mid-Level"
                role = random.choice(["Software Development Engineer II", "Senior Data Analyst", "Data Engineer", "Full Stack Web Developer", "DevOps Engineer"])
            elif exp <= 7:
                level = "Senior"
                role = random.choice(["Senior Software Engineer", "Data Scientist", "Machine Learning Engineer", "Cloud Security Consultant", "Scrum Master"])
            else:
                level = "Lead/Principal"
                role = random.choice(["Systems Architect", "Cloud Platform Engineer", "Technical Product Manager", "IT Project Consultant"])
                
            ind = random.choice(INDUSTRIES)
            loc = random.choice(INDIAN_LOCATIONS)
            
            row = [aid, grad_year, deg, field, role, ind, exp, loc, level, DATA_SOURCE_TAG]
            writer.writerow(row)
            alumni_records.append(row)
    print(f"[2/7] Generated {alumni_path} ({len(alumni_records)} records)")

    # 3. alumni_skills.csv (exactly 20,000 rows)
    alumni_skills_path = OUTPUT_DIR / "alumni_skills.csv"
    alumni_skill_rows = []
    seen_alumni_skill_pairs = set()

    # Step A: Correlated skill baskets per alumni
    for alum in alumni_records:
        aid = alum[0]
        role = alum[4]
        exp = int(alum[6])
        
        assigned_skills = set()
        if "Data" in role or "Machine Learning" in role:
            basket = random.sample(PYTHON_DATA_PACK, min(4, len(PYTHON_DATA_PACK)))
        elif "Web" in role or "Frontend" in role:
            basket = random.sample(FULLSTACK_JS_PACK, min(4, len(FULLSTACK_JS_PACK)))
        elif "Cloud" in role or "DevOps" in role:
            basket = random.sample(CLOUD_DEVOPS_PACK, min(4, len(CLOUD_DEVOPS_PACK)))
        elif "Engineer" in role or "Backend" in role:
            basket = random.sample(JAVA_ENTERPRISE_PACK, min(4, len(JAVA_ENTERPRISE_PACK)))
        else:
            basket = random.sample(SKILL_IDS, 3)
            
        assigned_skills.update(basket)
        # 8-11 skills per profile initially
        while len(assigned_skills) < 10:
            assigned_skills.add(random.choice(SKILL_IDS))
            
        for sid in assigned_skills:
            if (aid, sid) not in seen_alumni_skill_pairs:
                seen_alumni_skill_pairs.add((aid, sid))
                prof = random.choice(["Beginner", "Intermediate", "Advanced", "Expert"])
                used = min(exp, max(1, int(random.gauss(max(1, exp * 0.7), 1.0))))
                alumni_skill_rows.append([aid, sid, prof, used, DATA_SOURCE_TAG])

    # Step B: Fill exactly up to N_ALUMNI_SKILLS (20,000)
    while len(alumni_skill_rows) < N_ALUMNI_SKILLS:
        aid = random.choice(alumni_records)[0]
        sid = random.choice(SKILL_IDS)
        if (aid, sid) not in seen_alumni_skill_pairs:
            seen_alumni_skill_pairs.add((aid, sid))
            prof = random.choice(["Beginner", "Intermediate", "Advanced"])
            alumni_skill_rows.append([aid, sid, prof, random.randint(1, 4), DATA_SOURCE_TAG])

    with open(alumni_skills_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["alumni_id", "skill_id", "proficiency_level", "years_used", "data_source"])
        writer.writerows(alumni_skill_rows[:N_ALUMNI_SKILLS])
    print(f"[3/7] Generated {alumni_skills_path} ({len(alumni_skill_rows[:N_ALUMNI_SKILLS])} records)")

    # 4. jobs.csv (exactly 5,000 rows)
    job_records = []
    jobs_path = OUTPUT_DIR / "jobs.csv"
    with open(jobs_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "job_id", "job_title", "company_id", "company_name", "industry", 
            "location_region", "employment_type", "posted_date", "experience_level", "data_source"
        ])
        for j in range(1, N_JOBS + 1):
            jid = f"IND-JOB-{j:06d}"
            comp = random.choice(FICTIONAL_INDIAN_COMPANIES)
            title = random.choice(ALL_ROLES)
            loc = random.choice(INDIAN_LOCATIONS)
            emp_type = random.choices(["Full-Time", "Contract", "Internship"], weights=[85, 12, 3])[0]
            p_date = random_date(2022, 2026)
            
            if "Junior" in title or "Associate" in title or "I" in title:
                req_lvl = "Entry-Level"
            elif "Senior" in title or "Lead" in title or "Architect" in title:
                req_lvl = random.choice(["Senior", "Lead/Principal"])
            else:
                req_lvl = "Mid-Level"
                
            row = [jid, title, comp[0], comp[1], comp[2], loc, emp_type, p_date.isoformat(), req_lvl, DATA_SOURCE_TAG]
            writer.writerow(row)
            job_records.append(row)
    print(f"[4/7] Generated {jobs_path} ({len(job_records)} records)")

    # 5. job_skills.csv (exactly 15,000 rows)
    job_skills_path = OUTPUT_DIR / "job_skills.csv"
    job_skill_rows = []
    seen_job_skill_pairs = set()

    for j_row in job_records:
        jid = j_row[0]
        title = j_row[1]
        
        if "Data" in title or "ML" in title:
            pool = PYTHON_DATA_PACK
        elif "Frontend" in title or "Web" in title:
            pool = FULLSTACK_JS_PACK
        elif "Cloud" in title or "DevOps" in title:
            pool = CLOUD_DEVOPS_PACK
        elif "Software" in title:
            pool = JAVA_ENTERPRISE_PACK
        else:
            pool = SKILL_IDS
            
        selected = random.sample(pool, min(3, len(pool)))
        for sid in selected:
            if (jid, sid) not in seen_job_skill_pairs:
                seen_job_skill_pairs.add((jid, sid))
                req_lvl = random.choice(["Mandatory", "Preferred", "Good-to-have"])
                job_skill_rows.append([jid, sid, req_lvl, DATA_SOURCE_TAG])

    # Pad or trim to exactly 15,000
    while len(job_skill_rows) < N_JOB_SKILLS:
        jid = random.choice(job_records)[0]
        sid = random.choice(SKILL_IDS)
        if (jid, sid) not in seen_job_skill_pairs:
            seen_job_skill_pairs.add((jid, sid))
            job_skill_rows.append([jid, sid, "Preferred", DATA_SOURCE_TAG])

    with open(job_skills_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["job_id", "skill_id", "required_level", "data_source"])
        writer.writerows(job_skill_rows[:N_JOB_SKILLS])
    print(f"[5/7] Generated {job_skills_path} ({len(job_skill_rows[:N_JOB_SKILLS])} records)")

    # 6. applications.csv (exactly 6,000 rows)
    app_path = OUTPUT_DIR / "applications.csv"
    app_statuses = ["applied", "shortlisted", "interviewed", "offered", "hired", "rejected"]
    status_weights = [0.35, 0.22, 0.18, 0.08, 0.05, 0.12]

    with open(app_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "application_id", "alumni_id", "job_id", "application_date", 
            "application_status", "days_to_decision", "data_source"
        ])
        for a in range(1, N_APPLICATIONS + 1):
            appid = f"IND-APP-{a:06d}"
            alum = random.choice(alumni_records)
            job = random.choice(job_records)
            
            aid = alum[0]
            jid = job[0]
            job_post_date = datetime.date.fromisoformat(job[7])
            
            # Strict chronological ordering: Application date is 1-60 days AFTER job posting
            app_date = job_post_date + datetime.timedelta(days=random.randint(1, 60))
            status = random.choices(app_statuses, weights=status_weights)[0]
            
            if status in ["hired", "rejected", "offered"]:
                days_dec = random.randint(10, 45)
            else:
                days_dec = "" # Process still ongoing
                
            writer.writerow([appid, aid, jid, app_date.isoformat(), status, days_dec, DATA_SOURCE_TAG])
    print(f"[6/7] Generated {app_path} ({N_APPLICATIONS} records)")

    # 7. career_outcomes.csv (exactly 2,000 rows, 1:1 with alumni)
    outcomes_path = OUTPUT_DIR / "career_outcomes.csv"
    with open(outcomes_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "outcome_id", "alumni_id", "observation_period_months", 
            "employed_within_6_months", "career_level", "industry", 
            "experience_years_at_observation", "data_source"
        ])
        for idx, alum in enumerate(alumni_records, 1):
            oid = f"IND-OUT-{idx:06d}"
            aid = alum[0]
            exp = int(alum[6])
            level = alum[8]
            ind = alum[5]
            
            # Non-leaking stochastic classification target:
            # Base employment probability is 0.58 with subtle experience trend + noise
            prob = 0.58 + min(0.20, exp * 0.03)
            if level in ["Senior", "Lead/Principal"]:
                prob += 0.08
            # Add random Gaussian noise to prevent deterministic target leakage
            noise = random.gauss(0, 0.08)
            final_prob = max(0.20, min(0.92, prob + noise))
            target = 1 if random.random() < final_prob else 0
            
            writer.writerow([oid, aid, 6, target, level, ind, exp, DATA_SOURCE_TAG])
    print(f"[7/7] Generated {outcomes_path} ({N_ALUMNI} records)")

    print("=" * 70)
    print("ALL 7 DWM DATASETS SUCCESSFULLY GENERATED IN 'datasets/'")
    print(f"Total Records: {len(SKILLS_LIST) + len(alumni_records) + N_ALUMNI_SKILLS + len(job_records) + N_JOB_SKILLS + N_APPLICATIONS + N_ALUMNI:,}")
    print("=" * 70)

if __name__ == "__main__":
    main()
