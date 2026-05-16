/**
 * Typewriter Rotator — cycles through a list of phrases, typing each one
 * character-by-character, pausing, deleting, then typing the next.
 *
 * Classic AF landing-page hero pattern. Drop into any headline to give it a
 * rotating dynamic line that demonstrates multiple value propositions
 * without taking up vertical space.
 *
 * Per af-brand-doctrine: the rotation across Handwerk types is a RELATE-module
 * signal — AF serves breadth, not one persona. Anti-Orthodoxy vs lead portals
 * that funnel a single offering. Designed Moment: ✓ (rhythmic phrase arrival).
 *
 * Usage (inline in a headline):
 *   <h1>
 *     Wir bauen <TypewriterRotator words={[
 *       'Lead-Pipelines.',
 *       'Solar-Anfragen.',
 *       'Fallstudien.',
 *       'Marken.',
 *     ]} />
 *   </h1>
 *
 * Install:
 *   npx shadcn add https://raw.githubusercontent.com/JoeWolf1/af-registry/main/public/r/typewriter-rotator.json
 *
 * Follow-up (tracked 2026-05-17): this component does NOT yet honor
 * prefers-reduced-motion. Sibling primitives (swipe-in, scroll-reveal,
 * notification-arrive, press-like) already do. AF Showroom Inventory lab
 * report 2026-05-16 § Anti-pattern #2 + § Tier-1 #1 flagged this extraction
 * as the bug fix; the reduced-motion follow-up is queued separately.
 */

'use client';

import { useEffect, useState, type HTMLAttributes } from 'react';

function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export interface TypewriterRotatorProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** The list of phrases to cycle through. Loops back to the first after the last. */
  words: string[];
  /** Ms per character while typing (default: 60). */
  typingSpeedMs?: number;
  /** Ms per character while deleting (default: 32 — faster than typing). */
  deletingSpeedMs?: number;
  /** Ms to pause after a phrase is fully typed before starting to delete (default: 1500). */
  pauseAfterTypeMs?: number;
  /** Ms to pause after a phrase is fully deleted before typing the next (default: 250). */
  pauseBeforeNextMs?: number;
  /**
   * Cursor character (default: '|'). Set to '' to hide the cursor.
   * Common alternatives: '▍' (block), '_' (underscore).
   */
  cursorChar?: string;
  /** Cursor blink rate in ms (default: 530 — matches macOS Terminal). */
  cursorBlinkMs?: number;
  /** When false, stops after the last word is fully typed (no loop). */
  loop?: boolean;
}

type Phase = 'typing' | 'pause-after-type' | 'deleting' | 'pause-before-next' | 'stopped';

export function TypewriterRotator({
  words,
  typingSpeedMs = 60,
  deletingSpeedMs = 32,
  pauseAfterTypeMs = 1500,
  pauseBeforeNextMs = 250,
  cursorChar = '|',
  cursorBlinkMs = 530,
  loop = true,
  className,
  ...rest
}: TypewriterRotatorProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [phase, setPhase] = useState<Phase>('typing');
  const [cursorVisible, setCursorVisible] = useState(true);

  // Drive the typing / deleting state machine
  useEffect(() => {
    if (phase === 'stopped' || words.length === 0) return;
    const currentWord = words[wordIndex];

    let timer: ReturnType<typeof setTimeout>;

    if (phase === 'typing') {
      if (text.length < currentWord.length) {
        timer = setTimeout(
          () => setText(currentWord.slice(0, text.length + 1)),
          typingSpeedMs,
        );
      } else {
        timer = setTimeout(() => setPhase('pause-after-type'), 0);
      }
    } else if (phase === 'pause-after-type') {
      timer = setTimeout(() => {
        // If we're at the last word and not looping, stop here
        if (!loop && wordIndex === words.length - 1) {
          setPhase('stopped');
        } else {
          setPhase('deleting');
        }
      }, pauseAfterTypeMs);
    } else if (phase === 'deleting') {
      if (text.length > 0) {
        timer = setTimeout(
          () => setText(currentWord.slice(0, text.length - 1)),
          deletingSpeedMs,
        );
      } else {
        timer = setTimeout(() => setPhase('pause-before-next'), 0);
      }
    } else if (phase === 'pause-before-next') {
      timer = setTimeout(() => {
        setWordIndex((i) => (i + 1) % words.length);
        setPhase('typing');
      }, pauseBeforeNextMs);
    }

    return () => clearTimeout(timer);
  }, [phase, text, wordIndex, words, typingSpeedMs, deletingSpeedMs, pauseAfterTypeMs, pauseBeforeNextMs, loop]);

  // Blink the cursor independently of typing state
  useEffect(() => {
    if (!cursorChar) return;
    const blinkTimer = setInterval(() => setCursorVisible((v) => !v), cursorBlinkMs);
    return () => clearInterval(blinkTimer);
  }, [cursorChar, cursorBlinkMs]);

  return (
    <span className={cn('inline-flex items-baseline', className)} {...rest}>
      <span aria-live="polite" aria-atomic="true">{text}</span>
      {cursorChar && (
        <span
          aria-hidden="true"
          className="ml-[1px]"
          style={{
            opacity: cursorVisible ? 1 : 0,
            transition: 'opacity 80ms linear',
            // Slight color adjustment so the cursor reads as a UI element, not part of the word
            color: 'currentColor',
          }}
        >
          {cursorChar}
        </span>
      )}
    </span>
  );
}
