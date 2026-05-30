# ADR 0002 — TTS via Web Speech API + Wake Lock + Audio Beep

## Status
Accepted

## Context
The primary motivation for building the app over the CLI command is hands-free operation: no need to check the screen during a workout. Two signals are needed: exercise announcements and rest-timer completion.

## Decision
- **TTS**: Web Speech API (browser built-in) for exercise announcements — free, no API key, works on iOS and Android.
- **Rest-over signal**: A short audio beep (not TTS) — more reliable when the app regains foreground focus.
- **Screen**: Wake Lock API to keep the screen on during a session, preventing the browser from being suspended.

## Alternatives considered
- ElevenLabs / OpenAI TTS: higher voice quality but paid per character. Unnecessary for short functional announcements.
- Push notifications for timer: requires a service worker and notification permissions; more complex than wake lock for a foreground app.

## Consequences
The app must remain the active foreground browser tab during a session. Wake lock is well-supported on modern mobile browsers (iOS Safari 16.4+, Chrome Android). If the user explicitly locks their screen, audio will still be suspended — this is an accepted limitation.
