// Billing/Plan Utilities
// Placeholder für Stripe-Integration

import { Plan } from '@prisma/client'
import { prisma } from './db'

// Plan-Konfiguration
export const PLAN_CONFIG = {
  [Plan.STARTER]: {
    name: 'Starter',
    price: 0,
    maxRequestsPerMonth: 1, // 1 kostenlose Demo-Analyse
    maxApplicantsPerRequest: 10,
    features: ['1 Analyse kostenlos', 'Bis zu 10 Bewerbungen', 'Basis-Ranking', 'PDF Export'],
  },
  [Plan.PRO]: {
    name: 'Pro',
    price: 99,
    maxRequestsPerMonth: 50,
    maxApplicantsPerRequest: 100,
    features: [
      '50 Analysen/Monat',
      'Unbegrenzte Bewerbungen',
      'Detailliertes Skill-Matching',
      'CSV & PDF Export',
      'Team-Zugang (5 User)',
      'Priority Support',
    ],
  },
  [Plan.ENTERPRISE]: {
    name: 'Enterprise',
    price: -1, // Auf Anfrage
    maxRequestsPerMonth: Infinity,
    maxApplicantsPerRequest: Infinity,
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
}

// Prüfen ob Tenant noch Requests in diesem Monat machen kann
export async function canCreateRequest(tenantId: string): Promise<{
  allowed: boolean
  reason?: string
  requiresPayment: boolean
  isDemo: boolean
}> {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
  })

  if (!tenant) {
    return { allowed: false, reason: 'Tenant nicht gefunden', requiresPayment: false, isDemo: false }
  }

  const planConfig = PLAN_CONFIG[tenant.plan]

  // Requests in diesem Monat zählen
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const requestCount = await prisma.request.count({
    where: {
      tenantId,
      createdAt: { gte: startOfMonth },
      status: { notIn: ['DRAFT'] },
    },
  })

  // Starter Plan: 1 kostenlose Demo
  if (tenant.plan === Plan.STARTER) {
    if (requestCount === 0) {
      return { allowed: true, requiresPayment: false, isDemo: true }
    } else {
      return {
        allowed: false,
        reason: 'Kostenlose Demo bereits verwendet. Bitte upgraden Sie auf Pro.',
        requiresPayment: true,
        isDemo: false,
      }
    }
  }

  // Pro Plan: Limit prüfen
  if (tenant.plan === Plan.PRO) {
    if (requestCount < planConfig.maxRequestsPerMonth) {
      return { allowed: true, requiresPayment: false, isDemo: false }
    } else {
      return {
        allowed: false,
        reason: 'Monatliches Limit erreicht. Bitte upgraden Sie auf Enterprise.',
        requiresPayment: true,
        isDemo: false,
      }
    }
  }

  // Enterprise: Immer erlaubt
  return { allowed: true, requiresPayment: false, isDemo: false }
}

// Verbleibende Requests in diesem Monat
export async function getRemainingRequests(tenantId: string): Promise<{
  used: number
  limit: number
  unlimited: boolean
}> {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
  })

  if (!tenant) {
    return { used: 0, limit: 0, unlimited: false }
  }

  const planConfig = PLAN_CONFIG[tenant.plan]

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const used = await prisma.request.count({
    where: {
      tenantId,
      createdAt: { gte: startOfMonth },
      status: { notIn: ['DRAFT'] },
    },
  })

  return {
    used,
    limit: planConfig.maxRequestsPerMonth === Infinity ? 0 : planConfig.maxRequestsPerMonth,
    unlimited: planConfig.maxRequestsPerMonth === Infinity,
  }
}

// ============================================
// STRIPE PLACEHOLDER
// ============================================

/*
Für Stripe-Integration später:

1. Checkout Session erstellen:
   - Stripe Checkout für Plan-Upgrade
   - Webhook für erfolgreiche Zahlung

2. Customer Portal:
   - Billing-Management über Stripe Portal

3. Webhook Events:
   - checkout.session.completed → Plan upgraden
   - customer.subscription.updated → Plan ändern
   - customer.subscription.deleted → Plan auf Starter setzen

Beispiel:

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function createCheckoutSession(tenantId: string, plan: Plan) {
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } })
  
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: PLAN_STRIPE_PRICES[plan], quantity: 1 }],
    success_url: `${process.env.APP_BASE_URL}/t/${tenant.slug}/app/settings?success=true`,
    cancel_url: `${process.env.APP_BASE_URL}/t/${tenant.slug}/app/settings?canceled=true`,
    metadata: { tenantId },
  })

  return session.url
}
*/
