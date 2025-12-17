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
      title: 'Stellenausschreibungen + Bewerbungen',
      titleHighlight: '→ Skills + Ranking in Minuten',
      subtitle: 'Automatisierte Bewerberanalyse mit KI-gestütztem Skill-Matching. DSGVO-konform, transparent, effizient.',
      cta: 'Kostenlos testen',
      ctaSecondary: 'Demo ansehen',
    },
    steps: {
      title: 'So funktioniert es',
      step1: {
        title: 'Hochladen',
        description: 'Laden Sie Ihre Stellenausschreibung und Bewerbungen hoch (PDF, DOCX, TXT)',
      },
      step2: {
        title: 'Analyse',
        description: 'Unsere KI extrahiert Skills und erstellt ein detailliertes Matching',
      },
      step3: {
        title: 'Ergebnis',
        description: 'Erhalten Sie ein Ranking mit Score, Skills und Empfehlungen',
      },
    },
    features: {
      title: 'Warum MatchMap HR?',
      gdpr: {
        title: 'DSGVO-Konform',
        description: 'Ihre Daten werden sicher in der EU verarbeitet und auf Wunsch gelöscht',
      },
      multiTenant: {
        title: 'Multi-Tenant',
        description: 'Separate Arbeitsbereiche für Teams und Abteilungen',
      },
      audit: {
        title: 'Audit Trail',
        description: 'Vollständige Nachverfolgbarkeit aller Aktionen',
      },
      export: {
        title: 'Export',
        description: 'Ergebnisse als CSV oder PDF exportieren',
      },
    },
    pricing: {
      title: 'Pricing',
      subtitle: 'Wählen Sie den Plan, der zu Ihnen passt',
      starter: {
        name: 'Starter',
        price: 'Kostenlos',
        description: '1 Analyse zum Testen',
        features: [
          '1 Analyse kostenlos',
          'Bis zu 10 Bewerbungen',
          'Basis-Ranking',
          'PDF Export',
        ],
      },
      pro: {
        name: 'Pro',
        price: '€99/Monat',
        description: 'Für wachsende Teams',
        features: [
          '50 Analysen/Monat',
          'Unbegrenzte Bewerbungen',
          'Detailliertes Skill-Matching',
          'CSV & PDF Export',
          'Team-Zugang (5 User)',
          'Priority Support',
        ],
      },
      enterprise: {
        name: 'Enterprise',
        price: 'Auf Anfrage',
        description: 'Für große Organisationen',
        features: [
          'Unbegrenzte Analysen',
          'Unbegrenzte Bewerbungen',
          'Custom Skill-Gewichtung',
          'API-Zugang',
          'Unbegrenzte User',
          'Dedicated Support',
          'On-Premise Option',
        ],
      },
    },
    faq: {
      title: 'Häufig gestellte Fragen',
      items: [
        {
          question: 'Welche Dateiformate werden unterstützt?',
          answer: 'Wir unterstützen PDF, DOCX und TXT Dateien bis zu 10MB.',
        },
        {
          question: 'Wie werden meine Daten geschützt?',
          answer: 'Alle Daten werden verschlüsselt übertragen und in der EU gespeichert. Sie können jederzeit eine vollständige Löschung beantragen.',
        },
        {
          question: 'Wie kommt das Ranking zustande?',
          answer: 'Unsere KI extrahiert Skills aus der Stellenausschreibung und den Bewerbungen, vergleicht diese und berechnet einen Score basierend auf Übereinstimmung und Erfahrungslevel.',
        },
        {
          question: 'Kann ich das Ergebnis bearbeiten?',
          answer: 'Die Ergebnisse sind read-only, aber Sie können sie exportieren und in Ihrem ATS weiterverarbeiten.',
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
