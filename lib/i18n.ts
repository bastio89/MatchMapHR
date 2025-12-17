// Zentrale Übersetzungen für MatchMap HR
// UI auf Deutsch, aber strukturiert für spätere i18n

export const t = {
  // ============================================
  // COMMON
  // ============================================
  common: {
    appName: 'MatchMap HR',
    loading: 'Laden...',
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    create: 'Erstellen',
    back: 'Zurück',
    next: 'Weiter',
    submit: 'Absenden',
    search: 'Suchen',
    filter: 'Filtern',
    export: 'Exportieren',
    download: 'Herunterladen',
    upload: 'Hochladen',
    close: 'Schließen',
    confirm: 'Bestätigen',
    yes: 'Ja',
    no: 'Nein',
    or: 'oder',
    and: 'und',
    optional: 'optional',
    required: 'erforderlich',
    actions: 'Aktionen',
    details: 'Details',
    overview: 'Übersicht',
    settings: 'Einstellungen',
  },

  // ============================================
  // AUTH
  // ============================================
  auth: {
    signin: 'Anmelden',
    signup: 'Registrieren',
    signout: 'Abmelden',
    email: 'E-Mail-Adresse',
    password: 'Passwort',
    name: 'Ihr Name',
    companyName: 'Firmenname',
    forgotPassword: 'Passwort vergessen?',
    noAccount: 'Noch kein Konto?',
    hasAccount: 'Bereits ein Konto?',
    signinTitle: 'Willkommen zurück',
    signinSubtitle: 'Melden Sie sich an, um fortzufahren',
    signupTitle: 'Konto erstellen',
    signupSubtitle: 'Starten Sie mit Ihrer kostenlosen Testversion',
    termsAgree: 'Mit der Registrierung akzeptieren Sie unsere',
    terms: 'Nutzungsbedingungen',
    privacy: 'Datenschutzerklärung',
  },

  // ============================================
  // LANDING PAGE
  // ============================================
  landing: {
    hero: {
      title: 'Bewerbungs-Screening in Minuten',
      titleHighlight: 'statt Stunden',
      subtitle: 'Skill-basiertes Ranking für Ihre Kandidaten. Strukturiert, nachvollziehbar, zeitsparend. Wir ersetzen nicht Recruiter – wir ersetzen das manuelle Screening.',
      cta: 'Kostenlos testen',
      ctaSecondary: 'Beispiel ansehen',
      badges: [
        'Time-to-Screen ↓ 75%',
        'Strukturierte Kriterien',
        'DSGVO-konform',
      ],
    },
    problem: {
      title: 'Das Problem: Manuelles Screening kostet Zeit und Objektivität',
      pain1: 'Stunden pro Kandidat für CV-Durchsicht',
      pain2: 'Subjektive Bewertungen ohne einheitliche Kriterien',
      pain3: 'Überlastete Recruiter, verzögerte Rückmeldungen',
      solution: 'Unsere Lösung: Skill-basierte Vorauswahl mit nachvollziehbarem Ranking',
    },
    steps: {
      title: 'So funktioniert es – in 3 einfachen Schritten',
      step1: {
        title: '1. Stellenausschreibung hochladen',
        description: 'PDF, DOCX oder TXT – unser System extrahiert automatisch die geforderten Skills',
      },
      step2: {
        title: '2. Bewerbungen hochladen',
        description: 'Alle Kandidaten-CVs auf einmal – das Tool analysiert Skills, Erfahrung und Passgenauigkeit',
      },
      step3: {
        title: '3. Ranking erhalten',
        description: 'Strukturiertes Ergebnis mit Score, Skill-Matches und fehlenden Qualifikationen – bereit für Ihre Entscheidung',
      },
    },
    kpiBenefits: {
      title: 'Typische Vorteile in HR-Teams',
      subtitle: 'Viele unserer Kunden berichten von messbaren Verbesserungen',
      metric1: {
        label: 'Time-to-Screen',
        before: '2–4 Stunden pro Stelle',
        after: 'Unter 30 Minuten',
        description: 'Screening-Zeit kann typischerweise um 70–80% reduziert werden',
      },
      metric2: {
        label: 'Recruiter-Stunden pro Hire',
        before: '15–25 Stunden',
        after: '8–12 Stunden',
        description: 'Mehr Zeit für qualifizierte Gespräche statt Lebenslauf-Durchsicht',
      },
      metric3: {
        label: 'Interview-to-Hire Ratio',
        before: '4–6 Interviews',
        after: '2–3 Interviews',
        description: 'Bessere Vorauswahl führt zu gezielteren Einladungen',
      },
    },
    features: {
      title: 'Vertrauen durch Transparenz und Compliance',
      gdpr: {
        title: 'DSGVO-konform',
        description: 'Alle Daten bleiben in der EU. Sie behalten volle Kontrolle – Löschung jederzeit auf Anfrage möglich',
      },
      explainable: {
        title: 'Nachvollziehbare Bewertung',
        description: 'Jeder Score basiert auf vergleichbaren Kriterien. Keine Blackbox – Sie sehen, warum ein Kandidat passt',
      },
      structured: {
        title: 'Einheitliche Kriterien',
        description: 'Alle Kandidaten werden nach denselben Maßstäben bewertet – für faire, strukturierte Entscheidungen',
      },
      access: {
        title: 'Rollen & Zugriffsrechte',
        description: 'Separate Bereiche für Teams, kontrollierter Zugang, vollständiges Audit-Log aller Aktionen',
      },
    },
    pricing: {
      title: 'Transparente Preise',
      subtitle: 'Starten Sie kostenlos – upgraden Sie bei Bedarf',
      starter: {
        name: 'Starter',
        price: 'Kostenlos',
        description: 'Perfekt zum Testen',
        impact: 'Sparen Sie typischerweise 2–3 Stunden bei Ihrer ersten Analyse',
        features: [
          '1 Analyse kostenlos',
          'Bis zu 10 Bewerbungen',
          'Skill-basiertes Ranking',
          'PDF Export',
        ],
      },
      pro: {
        name: 'Pro',
        price: '€99/Monat',
        description: 'Für HR-Teams, die regelmäßig einstellen',
        impact: 'Kann Time-to-Hire um mehrere Tage verkürzen',
        features: [
          '50 Analysen/Monat',
          'Unbegrenzte Bewerbungen pro Analyse',
          'Detailliertes Skill-Matching',
          'CSV & PDF Export',
          'Team-Zugang (5 User)',
        ],
      },
      enterprise: {
        name: 'Enterprise',
        price: 'Auf Anfrage',
        description: 'Für Organisationen mit hohem Einstellungsbedarf',
        impact: 'Skalierbare Lösung für Dutzende offener Stellen',
        features: [
          'Unbegrenzte Analysen',
          'API-Zugang für ATS-Integration',
          'Custom Skill-Gewichtung',
          'Dedizierter Support',
          'On-Premise Option',
        ],
      },
    },
    faq: {
      title: 'Häufig gestellte Fragen',
      items: [
        {
          question: 'Wie kommt das Ranking zustande?',
          answer: 'Das Tool extrahiert Skills aus der Stellenausschreibung und gleicht sie mit den Bewerbungen ab. Jeder Kandidat erhält einen Score basierend auf Skill-Übereinstimmung, Erfahrungslevel und Relevanz. Sie sehen transparent, welche Skills gefunden wurden und welche fehlen.',
        },
        {
          question: 'Ist die Bewertung objektiv oder gibt es Bias?',
          answer: 'Das System bewertet anhand strukturierter Kriterien ohne persönliche Voreingenommenheit. Allerdings: Die Qualität hängt von der Stellenausschreibung ab. Wir empfehlen klare, skill-fokussierte Anforderungen. Eine finale menschliche Prüfung bleibt wichtig.',
        },
        {
          question: 'Wie werden meine Daten geschützt (DSGVO)?',
          answer: 'Alle Daten werden verschlüsselt in EU-Rechenzentren gespeichert. Sie können jederzeit eine vollständige Löschung beantragen. Wir verarbeiten nur, was für die Analyse nötig ist, und geben nichts an Dritte weiter.',
        },
        {
          question: 'Kann ich nachvollziehen, warum ein Kandidat einen bestimmten Score hat?',
          answer: 'Ja. Sie sehen für jeden Kandidaten: gefundene Skills, Highlights (wo er besonders stark passt), fehlende Skills und eine Zusammenfassung. So können Sie die Bewertung nachvollziehen und eigene Gewichtungen vornehmen.',
        },
        {
          question: 'Was passiert mit den Daten nach der Analyse?',
          answer: 'Die Dokumente bleiben so lange gespeichert, bis Sie sie löschen. Sie haben jederzeit volle Kontrolle. Auf Wunsch können Sie einzelne Anfragen oder Ihren gesamten Account inklusive aller Daten entfernen.',
        },
        {
          question: 'Welche Dateiformate werden unterstützt?',
          answer: 'PDF, DOCX und TXT bis zu 10 MB pro Datei. Das deckt die meisten Lebensläufe und Stellenausschreibungen ab.',
        },
        {
          question: 'Kann ich das Tool in unser bestehendes ATS integrieren?',
          answer: 'Im Enterprise-Plan bieten wir API-Zugang für Integrationen. Im Starter/Pro-Plan können Sie Ergebnisse als CSV oder PDF exportieren und manuell in Ihr System übertragen.',
        },
        {
          question: 'Ersetzt das Tool unsere Recruiter?',
          answer: 'Nein. Es ersetzt das manuelle Screening und spart Zeit bei der Vorauswahl. Die finale Entscheidung, Gespräche und kulturelle Passung bleiben bei Ihnen. Wir unterstützen – wir ersetzen nicht.',
        },
      ],
    },
    footer: {
      copyright: '© 2024 MatchMap HR. Alle Rechte vorbehalten.',
      imprint: 'Impressum',
      privacy: 'Datenschutz',
      terms: 'AGB',
    },
  },

  // ============================================
  // DASHBOARD
  // ============================================
  dashboard: {
    title: 'Dashboard',
    welcome: 'Willkommen zurück',
    newRequest: 'Neue Anfrage starten',
    recentRequests: 'Letzte Anfragen',
    noRequests: 'Noch keine Anfragen vorhanden',
    noRequestsDescription: 'Starten Sie Ihre erste Analyse, um Bewerbungen zu ranken.',
    startFirstRequest: 'Erste Anfrage starten',
    credits: {
      title: 'Ihr Plan',
      remaining: 'Verbleibende Analysen',
      unlimited: 'Unbegrenzt',
      upgrade: 'Upgrade',
    },
  },

  // ============================================
  // REQUESTS
  // ============================================
  requests: {
    title: 'Anfragen',
    newRequest: 'Neue Anfrage',
    noRequests: 'Keine Anfragen',
    noRequestsDescription: 'Erstellen Sie Ihre erste Analyse-Anfrage.',
    
    form: {
      title: 'Neue Analyse starten',
      jobTitle: 'Jobtitel',
      jobTitlePlaceholder: 'z.B. Senior Frontend Entwickler',
      department: 'Abteilung',
      departmentPlaceholder: 'z.B. Engineering',
      seniority: 'Seniorität',
      seniorityPlaceholder: 'z.B. Senior, Mid-Level',
      jobFile: 'Stellenausschreibung',
      jobFileDescription: 'Laden Sie die Stellenausschreibung hoch (PDF, DOCX, TXT)',
      applicantFiles: 'Bewerbungen',
      applicantFilesDescription: 'Laden Sie die Bewerbungen hoch (mehrere Dateien möglich)',
      startAnalysis: 'Analyse starten',
    },

    status: {
      DRAFT: 'Entwurf',
      PENDING_PAYMENT: 'Zahlung ausstehend',
      QUEUED: 'In Warteschlange',
      RUNNING: 'Wird analysiert',
      DONE: 'Abgeschlossen',
      FAILED: 'Fehlgeschlagen',
    },

    paymentStatus: {
      UNPAID: 'Nicht bezahlt',
      PENDING: 'Wird verarbeitet',
      PAID: 'Bezahlt',
      WAIVED: 'Kostenlos',
    },

    table: {
      createdAt: 'Erstellt am',
      jobTitle: 'Jobtitel',
      applicants: 'Bewerbungen',
      status: 'Status',
      actions: 'Aktionen',
    },

    detail: {
      title: 'Analyse-Details',
      timeline: 'Status-Verlauf',
      results: 'Ergebnisse',
      noResults: 'Noch keine Ergebnisse',
      noResultsDescription: 'Die Analyse läuft noch oder ist fehlgeschlagen.',
      candidate: 'Kandidat',
      score: 'Score',
      skills: 'Skills',
      highlights: 'Matches',
      missingSkills: 'Fehlende Skills',
      summary: 'Zusammenfassung',
      filter: {
        minScore: 'Mindestscore',
        hasSkill: 'Skill enthalten',
      },
      export: {
        csv: 'Als CSV exportieren',
        pdf: 'Als PDF exportieren',
      },
    },
  },

  // ============================================
  // SETTINGS
  // ============================================
  settings: {
    title: 'Einstellungen',
    tabs: {
      general: 'Allgemein',
      team: 'Team',
      api: 'API & Webhooks',
    },
    general: {
      title: 'Allgemeine Einstellungen',
      companyName: 'Firmenname',
      logo: 'Logo',
      logoUpload: 'Logo hochladen',
      save: 'Einstellungen speichern',
    },
    team: {
      title: 'Team-Mitglieder',
      invite: 'Mitglied einladen',
      noMembers: 'Keine weiteren Mitglieder',
      noMembersDescription: 'Laden Sie Teammitglieder ein, um gemeinsam zu arbeiten.',
      role: {
        OWNER: 'Eigentümer',
        ADMIN: 'Administrator',
        MEMBER: 'Mitglied',
      },
    },
    api: {
      title: 'API-Schlüssel',
      description: 'API-Schlüssel für externe Integrationen',
      createKey: 'Neuen Schlüssel erstellen',
      noKeys: 'Keine API-Schlüssel',
      noKeysDescription: 'Erstellen Sie einen API-Schlüssel für die Integration.',
      regenerate: 'Neu generieren',
      webhooks: {
        title: 'Webhooks',
        description: 'Webhooks für Echtzeit-Benachrichtigungen',
        url: 'Webhook URL',
        events: 'Events',
      },
    },
  },

  // ============================================
  // FILE UPLOAD
  // ============================================
  upload: {
    dropzone: {
      title: 'Datei hier ablegen',
      subtitle: 'oder klicken zum Auswählen',
      hint: 'PDF, DOCX, TXT bis 10MB',
    },
    uploading: 'Wird hochgeladen...',
    uploaded: 'Hochgeladen',
    remove: 'Entfernen',
    error: {
      size: 'Datei zu groß (max. 10MB)',
      type: 'Dateityp nicht unterstützt',
      upload: 'Upload fehlgeschlagen',
    },
  },

  // ============================================
  // ERRORS
  // ============================================
  errors: {
    general: 'Ein Fehler ist aufgetreten',
    notFound: 'Seite nicht gefunden',
    unauthorized: 'Nicht autorisiert',
    forbidden: 'Zugriff verweigert',
    serverError: 'Serverfehler',
    validation: 'Validierungsfehler',
    network: 'Netzwerkfehler',
    tryAgain: 'Bitte versuchen Sie es erneut',
  },

  // ============================================
  // BILLING
  // ============================================
  billing: {
    paymentRequired: 'Zahlung erforderlich',
    paymentRequiredDescription: 'Bitte schließen Sie die Zahlung ab, um die Analyse zu starten.',
    proceedToPayment: 'Zur Zahlung',
    freeDemo: 'Diese Analyse ist kostenlos (Demo)',
    planLimitReached: 'Ihr Plan-Limit ist erreicht',
    upgrade: 'Jetzt upgraden',
  },
}

export type TranslationKey = typeof t
export default t
