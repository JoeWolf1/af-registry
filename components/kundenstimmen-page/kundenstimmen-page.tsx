/**
 * Kundenstimmen Page — the auto-page generator for AF customer-story pages.
 *
 * Input: a single `KundenstimmenPageData` object describing the customer + the
 * story + the proof artifacts.
 *
 * Output: a complete kundenstimmen page composing every primitive in the AF
 * Werkschau library (iphone-chassis + macbook-pro-chassis + whatsapp-chat +
 * af-ios-notification + scroll-reveal + typewriter-rotator + press-like +
 * youtube-player). No new visual logic — every section is a composition of
 * existing primitives.
 *
 * Use case: feed in HOBA Solar's data → get HOBA Solar's kundenstimmen page.
 * Feed in Volt On ESS → get theirs. The same generator, parametric.
 *
 * Install:
 *   npx shadcn add https://raw.githubusercontent.com/JoeWolf1/af-registry/main/public/r/kundenstimmen-page.json
 */

'use client';

import { type ReactNode } from 'react';
import { IPhoneChassis } from './iphone-chassis';
import { MacbookProChassis } from './macbook-pro-chassis';
import {
  WhatsAppHeader,
  WhatsAppBackground,
  WhatsAppBubble,
  WhatsAppDaySeparator,
  type WhatsAppMessage,
  type WhatsAppContact,
} from './whatsapp-chat';
import { AfIosNotification } from './af-ios-notification';
import { ScrollReveal } from './scroll-reveal';
import { TypewriterRotator } from './typewriter-rotator';
import { YoutubePlayer, AfYoutubeGradientPoster } from './youtube-player';

// -----------------------------------------------------------------------------
// Data contract — feed this in, get a kundenstimmen page out
// -----------------------------------------------------------------------------

export interface KundenstimmenStat {
  /** Big-number value, e.g. '27', '€840k', '+187%'. */
  value: string;
  /** Caption below the value. */
  label: string;
  /** Optional accent color. Default --af-pulse. */
  accentColor?: string;
}

export interface KundenstimmenTestimonial {
  /** Author name + role/company. */
  author: string;
  authorRole: string;
  /** The body of the testimonial. */
  quote: ReactNode;
}

export interface KundenstimmenPageData {
  /** Eyebrow text above the hero headline (e.g. "HOBA Solar GmbH · Q1 2026"). */
  eyebrow: string;
  /** Hero headline — first part (static prefix). */
  heroBefore: string;
  /** Hero headline — rotating tail words for the TypewriterRotator. */
  heroAfter: string[];
  /** Hero sub-headline / lead paragraph. */
  heroLead: ReactNode;

  /** The before / after framing. */
  before: { metric: string; value: string };
  after: { metric: string; value: string };

  /** Three stat cards in the proof row. */
  proofStats: [KundenstimmenStat, KundenstimmenStat, KundenstimmenStat];

  /** WhatsApp testimonial — the customer's actual message. */
  whatsapp: {
    contact: WhatsAppContact;
    daySeparator?: string;
    messages: WhatsAppMessage[];
  };

  /** Optional YouTube case-study embed. */
  youtube?: {
    title: string;
    channel: string;
    views: number;
    postedAt: string;
    durationSec: number;
    posterTitle: string;
    description?: ReactNode;
    likes?: number;
  };

  /** Pull-quote testimonial (often from a follow-up interview). */
  testimonial: KundenstimmenTestimonial;

  /** Three social-proof notification cards (recent leads / wins). */
  socialProof: {
    appName: string;
    title: string;
    body: string;
    time?: string;
  }[];

  /** CTA section. */
  cta: {
    eyebrow: string;
    headline: string;
    buttonLabel: string;
    buttonHref?: string;
  };
}

// -----------------------------------------------------------------------------
// Layout primitives — internal to the generator (not exported as registry)
// -----------------------------------------------------------------------------

function Section({
  children,
  background = '#FBFAF7',
  dark = false,
  pad = 96,
}: { children: ReactNode; background?: string; dark?: boolean; pad?: number }) {
  return (
    <section
      style={{
        background,
        padding: `${pad}px 48px`,
        color: dark ? 'var(--af-paper)' : 'var(--af-ink)',
      }}
    >
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>{children}</div>
    </section>
  );
}

function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div
      style={{
        fontFamily: 'var(--af-font-mono)',
        fontSize: 11,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: dark ? 'var(--af-pulse)' : 'var(--af-pulse)',
        marginBottom: 16,
      }}
    >
      {children}
    </div>
  );
}

function StatCard({ stat }: { stat: KundenstimmenStat }) {
  return (
    <div
      style={{
        background: 'var(--af-paper)',
        border: '1px solid var(--af-ink-glow-08)',
        borderRadius: 20,
        padding: '40px 56px',
        textAlign: 'center',
        boxShadow: '0 16px 40px rgba(1,14,38,0.06)',
        minWidth: 240,
      }}
    >
      <div
        style={{
          fontSize: 72,
          fontWeight: 700,
          color: stat.accentColor || 'var(--af-pulse)',
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}
      >
        {stat.value}
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--af-ink-muted)',
          marginTop: 14,
        }}
      >
        {stat.label}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// THE GENERATOR
// -----------------------------------------------------------------------------

export interface KundenstimmenPageProps {
  data: KundenstimmenPageData;
}

export function KundenstimmenPage({ data }: KundenstimmenPageProps) {
  return (
    <div
      style={{
        fontFamily: 'var(--af-font-sans)',
        color: 'var(--af-ink)',
        background: '#FBFAF7',
      }}
    >
      {/* ─────────── HERO ─────────── */}
      <Section background="#FBFAF7" pad={120}>
        <div style={{ textAlign: 'center', maxWidth: 920, margin: '0 auto' }}>
          <Eyebrow>{data.eyebrow}</Eyebrow>
          <h1
            style={{
              fontSize: 64,
              fontWeight: 700,
              letterSpacing: '-0.022em',
              lineHeight: 1.05,
              margin: '0 0 28px',
            }}
          >
            {data.heroBefore}{' '}
            <TypewriterRotator
              words={data.heroAfter}
              style={{ color: 'var(--af-pulse)' }}
              loop
            />
          </h1>
          <p
            style={{
              fontSize: 19,
              lineHeight: 1.55,
              color: 'var(--af-ink-muted)',
              maxWidth: 720,
              margin: '0 auto',
            }}
          >
            {data.heroLead}
          </p>
        </div>
      </Section>

      {/* ─────────── BEFORE / AFTER ─────────── */}
      <Section background="#F4F2EC" pad={88}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            gap: 32,
            maxWidth: 820,
            margin: '0 auto',
          }}
        >
          <ScrollReveal from="left">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: 'var(--af-ink-muted)', marginBottom: 8 }}>VORHER</div>
              <div style={{ fontSize: 56, fontWeight: 700, color: '#9CA3AF', lineHeight: 1 }}>
                {data.before.value}
              </div>
              <div style={{ fontSize: 13, color: 'var(--af-ink-muted)', marginTop: 8 }}>
                {data.before.metric}
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal from="down">
            <div style={{ fontSize: 32, color: 'var(--af-pulse)' }}>→</div>
          </ScrollReveal>
          <ScrollReveal from="right">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: 'var(--af-ink-muted)', marginBottom: 8 }}>NACHHER</div>
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 700,
                  color: 'var(--af-pulse)',
                  lineHeight: 1,
                }}
              >
                {data.after.value}
              </div>
              <div style={{ fontSize: 13, color: 'var(--af-ink-muted)', marginTop: 8 }}>
                {data.after.metric}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </Section>

      {/* ─────────── PROOF STATS ROW ─────────── */}
      <Section pad={96}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
            maxWidth: 1000,
            margin: '0 auto',
          }}
        >
          {data.proofStats.map((stat, i) => (
            <ScrollReveal key={i} from="down" delayMs={i * 140}>
              <StatCard stat={stat} />
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* ─────────── WHATSAPP TESTIMONIAL ON IPHONE ─────────── */}
      <Section background="var(--af-ink)" dark pad={120}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <Eyebrow dark>Echte Anfragen, echtes Vertrauen</Eyebrow>
          <h2 style={{ fontSize: 40, fontWeight: 700, margin: '0 auto', maxWidth: 720, letterSpacing: '-0.01em' }}>
            Was {data.whatsapp.contact.name.split(' ')[0]} uns geschickt hat.
          </h2>
        </div>
        <ScrollReveal from="up">
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <IPhoneChassis size="default" immersive wallpaper="none">
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <WhatsAppHeader contact={data.whatsapp.contact} />
                <WhatsAppBackground>
                  {data.whatsapp.daySeparator && (
                    <WhatsAppDaySeparator>{data.whatsapp.daySeparator}</WhatsAppDaySeparator>
                  )}
                  {data.whatsapp.messages.map((m, i) => (
                    <WhatsAppBubble key={i} message={m} />
                  ))}
                </WhatsAppBackground>
              </div>
            </IPhoneChassis>
          </div>
        </ScrollReveal>
      </Section>

      {/* ─────────── YOUTUBE CASE STUDY (optional) ─────────── */}
      {data.youtube && (
        <Section pad={104}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <Eyebrow>Die komplette Pipeline-Analyse</Eyebrow>
            <h2
              style={{
                fontSize: 40,
                fontWeight: 700,
                margin: '0 auto',
                maxWidth: 720,
                letterSpacing: '-0.01em',
              }}
            >
              12 Minuten, die alles erklären.
            </h2>
          </div>
          <ScrollReveal from="up">
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
              <YoutubePlayer
                variant="embed"
                videoFrame={<AfYoutubeGradientPoster title={data.youtube.posterTitle} />}
                title={data.youtube.title}
                channel={data.youtube.channel}
                channelAvatar="A"
                subscribers="12,4K Abonnenten"
                views={data.youtube.views}
                postedAt={data.youtube.postedAt}
                durationSec={data.youtube.durationSec}
                currentTimeSec={0}
                likes={data.youtube.likes || 0}
                description={data.youtube.description}
              />
            </div>
          </ScrollReveal>
        </Section>
      )}

      {/* ─────────── PULL QUOTE ─────────── */}
      <Section background="#F4F2EC" pad={120}>
        <ScrollReveal from="up">
          <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontSize: 96, color: 'var(--af-pulse)', lineHeight: 0.5, marginBottom: 24 }}>
              "
            </div>
            <p
              style={{
                fontSize: 26,
                lineHeight: 1.4,
                fontWeight: 500,
                color: 'var(--af-ink)',
                margin: '0 0 36px',
                letterSpacing: '-0.005em',
              }}
            >
              {data.testimonial.quote}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #60A5FA, #8B5CF6)',
                  color: '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: 16,
                }}
              >
                {data.testimonial.author
                  .split(' ')
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join('')}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{data.testimonial.author}</div>
                <div style={{ fontSize: 13, color: 'var(--af-ink-muted)' }}>
                  {data.testimonial.authorRole}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </Section>

      {/* ─────────── SOCIAL PROOF NOTIFICATIONS ─────────── */}
      <Section pad={104}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Eyebrow>So sieht echtes Wachstum aus</Eyebrow>
          <h2
            style={{
              fontSize: 36,
              fontWeight: 700,
              margin: '0 auto',
              maxWidth: 720,
              letterSpacing: '-0.005em',
            }}
          >
            Anfragen landen jeden Tag.
          </h2>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16,
            maxWidth: 1100,
            margin: '0 auto',
          }}
        >
          {data.socialProof.map((n, i) => (
            <ScrollReveal key={i} from="down" delayMs={i * 120}>
              <AfIosNotification
                appName={n.appName}
                title={n.title}
                body={n.body}
                time={n.time || 'jetzt'}
              />
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* ─────────── CTA ─────────── */}
      <Section background="var(--af-ink)" dark pad={120}>
        <ScrollReveal from="up">
          <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
            <Eyebrow dark>{data.cta.eyebrow}</Eyebrow>
            <h2
              style={{
                fontSize: 52,
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                margin: '0 0 36px',
              }}
            >
              {data.cta.headline}
            </h2>
            <a
              href={data.cta.buttonHref || '#'}
              style={{
                display: 'inline-block',
                padding: '16px 36px',
                background: 'var(--af-pulse)',
                color: 'var(--af-paper)',
                borderRadius: 999,
                fontSize: 17,
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 12px 32px rgba(96,165,250,0.4)',
              }}
            >
              {data.cta.buttonLabel} →
            </a>
          </div>
        </ScrollReveal>
      </Section>
    </div>
  );
}
