# MatchMap HR

Eine moderne Multi-Tenant SaaS-Plattform für HR-Teams, um Stellenbeschreibungen und Bewerbungen hochzuladen, automatische Skill-Extraktion durchzuführen und Kandidaten zu ranken.

## ✨ Features

- **Multi-Tenant Architektur** - Vollständige Mandantentrennung mit URL-basiertem Routing (`/t/[tenantSlug]/...`)
- **Rollenbasierte Zugriffskontrolle (RBAC)** - Owner, Admin, Member
- **Datei-Upload** - Drag & Drop für Stellenbeschreibungen und Bewerbungen (PDF, DOCX, TXT)
- **n8n Integration** - Automatische Skill-Extraktion und Kandidaten-Ranking via Webhook
- **Modernes UI** - Tailwind CSS + shadcn/ui mit deutschsprachiger Benutzeroberfläche
- **Billing Placeholders** - Starter (kostenlos), Pro, Enterprise Pläne vorbereitet

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui Komponenten
- **Auth:** Supabase
- **Database:** PostgreSQL + Prisma ORM
- **Datei-Storage:** Lokaler Storage (S3-ready Interface)
- **Workflow:** n8n Webhook Integration

## 🚀 Quick Start

### Voraussetzungen

- Node.js 18+
- Docker & Docker Compose
- n8n Instanz (optional, für Matching-Funktionalität)

### 1. Repository klonen & Dependencies installieren

```bash
cd MatchMapHR
npm install
```

### 2. Umgebungsvariablen konfigurieren

```bash
cp .env.example .env
```

Die wichtigsten Variablen in `.env`:

```env
# PostgreSQL (via Docker)
DATABASE_URL="postgresql://matchmap:matchmap123@localhost:5432/matchmap_hr?schema=public"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# n8n Integration
N8N_WEBHOOK_URL="http://localhost:5678/webhook/matchmap"
N8N_WEBHOOK_SECRET="your-secret"
N8N_CALLBACK_HMAC_SECRET="your-callback-secret"
```

### 3. Datenbank starten

```bash
docker compose up -d
```

### 4. Prisma migrieren & seeden

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 5. Entwicklungsserver starten

```bash
npm run dev
```

Die App läuft jetzt unter **http://localhost:3000**

## 👤 Demo Login

Für die Entwicklung sind folgende Demo-Credentials vorkonfiguriert:

- **E-Mail:** `demo@matchmap.hr`
- **Passwort:** `demo1234`
- **Tenant:** Demo Firma GmbH (`demo-firma-gmbh`)

Nach dem Login werden Sie zu `/t/demo-firma-gmbh/app/dashboard` weitergeleitet.

## 📁 Projektstruktur

```
MatchMapHR/
├── app/
│   ├── api/
│   │   ├── auth/            # Signin, Signup, Signout
│   │   ├── n8n/callback/    # n8n Webhook Callback
│   │   └── t/[tenantSlug]/  # Tenant-scoped APIs
│   │       ├── requests/    # CRUD für Requests
│   │       └── files/       # Datei-Downloads
│   ├── auth/                # Public Auth Pages
│   └── t/[tenantSlug]/app/  # Protected App Pages
│       ├── dashboard/
│       ├── new-request/
│       ├── requests/
│       └── settings/
├── components/
│   ├── ui/                  # shadcn/ui Komponenten
│   ├── file-dropzone.tsx
│   ├── status-timeline.tsx
│   ├── empty-state.tsx
│   └── data-table.tsx
├── lib/
│   ├── db.ts               # Prisma Client
│   ├── supabase.ts         # Supabase Client
│   ├── tenant.ts           # Tenant Context & RBAC
│   ├── n8n.ts              # n8n Integration
│   ├── storage.ts          # File Storage
│   ├── validators.ts       # Zod Schemas
│   ├── billing.ts          # Plan Limits
│   └── i18n.ts             # Deutsche UI Strings
└── prisma/
    ├── schema.prisma       # Datenbank Schema
    └── seed.ts             # Demo Daten
```

## 🔗 n8n Integration

### Workflow Trigger

Wenn ein neuer Request gestartet wird, sendet MatchMap HR folgendes Payload an n8n:

**POST** `{N8N_WEBHOOK_URL}`

**Headers:**
```
Content-Type: application/json
X-Webhook-Secret: {N8N_WEBHOOK_SECRET}
```

**Body:**
```json
{
  "requestId": "clxyz123...",
  "tenantId": "clxyz456...",
  "callbackUrl": "https://your-app.com/api/n8n/callback",
  "jobFile": {
    "id": "clxyz789...",
    "name": "stellenbeschreibung.pdf",
    "url": "https://your-app.com/api/t/demo-firma-gmbh/files/clxyz789..."
  },
  "applicantFiles": [
    {
      "id": "clxyz111...",
      "name": "bewerbung_max_mustermann.pdf",
      "url": "https://your-app.com/api/t/demo-firma-gmbh/files/clxyz111..."
    },
    {
      "id": "clxyz222...",
      "name": "bewerbung_anna_schmidt.pdf",
      "url": "https://your-app.com/api/t/demo-firma-gmbh/files/clxyz222..."
    }
  ],
  "metadata": {
    "title": "Senior Frontend Developer",
    "tenantName": "Demo Firma GmbH",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Callback Endpoint

Nach Abschluss der Analyse ruft n8n den Callback-Endpoint auf:

**POST** `https://your-app.com/api/n8n/callback`

**Headers:**
```
Content-Type: application/json
X-Signature: {HMAC-SHA256 Signatur des Body}
```

**Body (Erfolg):**
```json
{
  "requestId": "clxyz123...",
  "status": "DONE",
  "results": [
    {
      "candidateName": "Max Mustermann",
      "email": "max@example.com",
      "score": 92,
      "skills": ["React", "TypeScript", "Node.js", "GraphQL"],
      "highlights": [
        "5 Jahre React-Erfahrung",
        "Lead Developer bei Vorheriger Firma",
        "Open Source Contributor"
      ],
      "missingSkills": ["AWS", "Kubernetes"],
      "summary": "Sehr erfahrener Frontend-Entwickler mit starkem React-Background..."
    },
    {
      "candidateName": "Anna Schmidt",
      "email": "anna@example.com",
      "score": 85,
      "skills": ["Vue.js", "TypeScript", "CSS/SASS"],
      "highlights": [
        "3 Jahre Vue.js Erfahrung",
        "Design-Hintergrund"
      ],
      "missingSkills": ["React", "Node.js"],
      "summary": "Talentierte Entwicklerin mit Fokus auf UI/UX..."
    }
  ]
}
```

**Body (Fehler):**
```json
{
  "requestId": "clxyz123...",
  "status": "FAILED",
  "error": "Fehler bei der Dokumentenanalyse: Ungültiges PDF-Format"
}
```

### HMAC Signatur Generierung (für n8n)

```javascript
// In n8n Function Node
const crypto = require('crypto');
const secret = 'your-callback-secret';
const body = JSON.stringify($json);
const signature = crypto
  .createHmac('sha256', secret)
  .update(body)
  .digest('hex');

// Header setzen
$headers['X-Signature'] = signature;
```

## 📊 Datenbank Schema

### Hauptentitäten

| Tabelle | Beschreibung |
|---------|-------------|
| `Tenant` | Mandanten (Unternehmen) |
| `User` | Benutzer (global) |
| `TenantUser` | Benutzer-Mandant-Zuordnung mit Rolle |
| `Request` | Matching-Anfragen |
| `JobFile` | Stellenbeschreibungs-Dateien |
| `ApplicantFile` | Bewerbungs-Dateien |
| `ResultCandidate` | Matching-Ergebnisse |
| `WebhookEventLog` | Webhook Event Log |
| `ApiKey` | API Keys pro Mandant |

### Request Status Flow

```
DRAFT → QUEUED → RUNNING → DONE
                        ↘ FAILED
```

## 🔒 Sicherheit

- **Tenant Isolation:** Alle Datenbankabfragen sind auf `tenantId` gefiltert
- **RBAC:** Owner > Admin > Member Rollen pro Tenant
- **HMAC Signierung:** n8n Callbacks werden via HMAC-SHA256 verifiziert
- **Datei-Zugriff:** Downloads prüfen Tenant-Zugehörigkeit

## 🌐 Deployment

### Vercel (Empfohlen)

1. Repository mit Vercel verbinden
2. Environment Variables konfigurieren
3. Deploy

### Docker

```bash
docker build -t matchmap-hr .
docker run -p 3000:3000 matchmap-hr
```

## 📝 Nächste Schritte (TODO)

- [ ] Supabase Auth Integration vervollständigen
- [ ] S3/R2 Storage Provider implementieren
- [ ] Stripe Billing Integration
- [ ] E-Mail Benachrichtigungen
- [ ] Export-Funktionen (PDF, CSV)
- [ ] Team-Einladungen via E-Mail
- [ ] Request Archivierung
- [ ] API Rate Limiting

## 📄 Lizenz

Proprietär - Alle Rechte vorbehalten.

---

Erstellt mit ❤️ für moderne HR-Teams.
