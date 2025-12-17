import { PrismaClient, Plan, TenantRole, RequestStatus, PaymentStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ============================================
  // 1. Demo Tenant erstellen
  // ============================================
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo-firma' },
    update: {},
    create: {
      slug: 'demo-firma',
      name: 'Demo Firma GmbH',
      plan: Plan.STARTER,
    },
  })
  console.log('✅ Tenant erstellt:', tenant.name)

  // ============================================
  // 2. Demo User (Owner) erstellen
  // ============================================
  const owner = await prisma.user.upsert({
    where: { email: 'demo@matchmap.hr' },
    update: {},
    create: {
      email: 'demo@matchmap.hr',
      name: 'Max Mustermann',
      // Passwort: "demo1234" - In Produktion über Supabase Auth
      passwordHash: '$2a$10$demo.hash.placeholder',
    },
  })
  console.log('✅ Owner User erstellt:', owner.email)

  // ============================================
  // 3. TenantUser Verbindung (Owner)
  // ============================================
  await prisma.tenantUser.upsert({
    where: {
      tenantId_userId: {
        tenantId: tenant.id,
        userId: owner.id,
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      userId: owner.id,
      role: TenantRole.OWNER,
    },
  })
  console.log('✅ TenantUser Verbindung erstellt')

  // ============================================
  // 4. Request 1: DONE mit Ergebnissen
  // ============================================
  const request1 = await prisma.request.create({
    data: {
      tenantId: tenant.id,
      createdByUserId: owner.id,
      jobTitle: 'Senior Frontend Entwickler (React)',
      department: 'Engineering',
      seniority: 'Senior',
      status: RequestStatus.DONE,
      paymentStatus: PaymentStatus.WAIVED,
      n8nExecutionId: 'n8n-exec-demo-001',
      completedAt: new Date(),
    },
  })
  console.log('✅ Request 1 (DONE) erstellt')

  // JobFile für Request 1
  await prisma.jobFile.create({
    data: {
      requestId: request1.id,
      filename: 'stellenausschreibung-frontend.pdf',
      mimeType: 'application/pdf',
      storagePath: `/uploads/${tenant.id}/${request1.id}/job/stellenausschreibung-frontend.pdf`,
      fileSize: 125000,
      extractedText: 'Wir suchen einen erfahrenen Frontend Entwickler mit React-Kenntnissen...',
    },
  })

  // ApplicantFiles für Request 1
  const applicants = [
    { name: 'bewerbung-mueller.pdf', size: 245000 },
    { name: 'bewerbung-schmidt.pdf', size: 312000 },
    { name: 'bewerbung-weber.pdf', size: 198000 },
  ]
  
  for (const applicant of applicants) {
    await prisma.applicantFile.create({
      data: {
        requestId: request1.id,
        filename: applicant.name,
        mimeType: 'application/pdf',
        storagePath: `/uploads/${tenant.id}/${request1.id}/applicants/${applicant.name}`,
        fileSize: applicant.size,
      },
    })
  }
  console.log('✅ Dateien für Request 1 erstellt')

  // ResultCandidates für Request 1
  const results = [
    {
      candidateName: 'Anna Müller',
      email: 'anna.mueller@email.de',
      score: 92,
      skills: ['React', 'TypeScript', 'Next.js', 'CSS', 'Jest', 'GraphQL'],
      highlights: [
        { skill: 'React', evidence: '5 Jahre Erfahrung mit React, Lead Developer bei TechCorp' },
        { skill: 'TypeScript', evidence: 'TypeScript in allen Projekten seit 2020' },
        { skill: 'Next.js', evidence: 'Mehrere Production Apps mit Next.js 13/14' },
      ],
      missing: ['AWS'],
      summary: 'Hervorragende Kandidatin mit starkem Frontend-Background. Besonders stark in React und TypeScript. Hat Team-Lead Erfahrung.',
    },
    {
      candidateName: 'Thomas Schmidt',
      email: 'thomas.schmidt@mail.de',
      score: 78,
      skills: ['React', 'JavaScript', 'Vue.js', 'HTML/CSS', 'Redux'],
      highlights: [
        { skill: 'React', evidence: '3 Jahre React-Entwicklung' },
        { skill: 'JavaScript', evidence: 'Solide JS-Kenntnisse, auch Vanilla JS' },
      ],
      missing: ['TypeScript', 'Next.js', 'Testing'],
      summary: 'Guter Kandidat mit solider Erfahrung. TypeScript-Kenntnisse sollten vertieft werden.',
    },
    {
      candidateName: 'Lisa Weber',
      email: 'l.weber@company.com',
      score: 65,
      skills: ['React', 'CSS', 'Bootstrap', 'jQuery'],
      highlights: [
        { skill: 'React', evidence: '2 Jahre React-Erfahrung' },
        { skill: 'CSS', evidence: 'Starke CSS/SCSS Kenntnisse' },
      ],
      missing: ['TypeScript', 'Next.js', 'Testing', 'GraphQL'],
      summary: 'Junior-Mid Level Kandidatin. Gute Grundlagen, aber Lücken in modernen Tools.',
    },
  ]

  for (const result of results) {
    await prisma.resultCandidate.create({
      data: {
        requestId: request1.id,
        candidateName: result.candidateName,
        email: result.email,
        score: result.score,
        skillsJson: { skills: result.skills },
        highlightsJson: { highlights: result.highlights },
        missingSkillsJson: { missing: result.missing },
        summary: result.summary,
      },
    })
  }
  console.log('✅ Ergebnisse für Request 1 erstellt')

  // ============================================
  // 5. Request 2: RUNNING (in Bearbeitung)
  // ============================================
  const request2 = await prisma.request.create({
    data: {
      tenantId: tenant.id,
      createdByUserId: owner.id,
      jobTitle: 'DevOps Engineer (Kubernetes)',
      department: 'Operations',
      seniority: 'Mid-Senior',
      status: RequestStatus.RUNNING,
      paymentStatus: PaymentStatus.PAID,
      n8nExecutionId: 'n8n-exec-demo-002',
    },
  })
  console.log('✅ Request 2 (RUNNING) erstellt')

  // JobFile für Request 2
  await prisma.jobFile.create({
    data: {
      requestId: request2.id,
      filename: 'devops-engineer-position.pdf',
      mimeType: 'application/pdf',
      storagePath: `/uploads/${tenant.id}/${request2.id}/job/devops-engineer-position.pdf`,
      fileSize: 98000,
    },
  })

  // ApplicantFiles für Request 2
  const applicants2 = [
    { name: 'kandidat-bauer.pdf', size: 287000 },
    { name: 'kandidat-fischer.pdf', size: 195000 },
  ]
  
  for (const applicant of applicants2) {
    await prisma.applicantFile.create({
      data: {
        requestId: request2.id,
        filename: applicant.name,
        mimeType: 'application/pdf',
        storagePath: `/uploads/${tenant.id}/${request2.id}/applicants/${applicant.name}`,
        fileSize: applicant.size,
      },
    })
  }
  console.log('✅ Dateien für Request 2 erstellt')

  // ============================================
  // 6. API Key erstellen
  // ============================================
  await prisma.apiKey.create({
    data: {
      tenantId: tenant.id,
      name: 'Demo API Key',
      keyHash: 'demo-key-hash-placeholder',
      keyPrefix: 'mm_demo_',
    },
  })
  console.log('✅ API Key erstellt')

  // ============================================
  // 7. Webhook Event Log Beispiel
  // ============================================
  await prisma.webhookEventLog.create({
    data: {
      tenantId: tenant.id,
      requestId: request1.id,
      eventType: 'N8N_CALLBACK',
      payloadJson: {
        status: 'DONE',
        executionId: 'n8n-exec-demo-001',
        resultsCount: 3,
      },
    },
  })
  console.log('✅ Webhook Event Log erstellt')

  console.log('')
  console.log('🎉 Database seeding abgeschlossen!')
  console.log('')
  console.log('📋 Demo Login-Daten:')
  console.log('   Email: demo@matchmap.hr')
  console.log('   Passwort: demo1234')
  console.log('   Tenant URL: /t/demo-firma/app/dashboard')
  console.log('')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
