<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Recurly Expo subscription management app. The following changes were made:

- **`app.config.js`** (new): Replaces `app.json` as the Expo config entry point, forwarding `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from environment variables into `expo-constants` extras.
- **`.env`** (updated): Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` keys.
- **`src/config/posthog.ts`** (new): PostHog client singleton configured via `expo-constants`, with app lifecycle capture, batching, and development debug mode.
- **`app/_layout.tsx`** (edited): Wrapped the app in `PostHogProvider` and added manual screen tracking using `usePathname` and `useGlobalSearchParams` for Expo Router compatibility.
- **`app/(auth)/sign-in.tsx`** (edited): Identifies the user and tracks a sign-in event on successful authentication, with the auth method recorded as a property.
- **`app/(auth)/sign-up.tsx`** (edited): Identifies the user with a first-seen signup date and tracks a sign-up event after successful verification.
- **`app/(tabs)/settings.tsx`** (edited): Tracks a sign-out event and resets the PostHog session before Clerk signs the user out.
- **`app/components/SubscritpionCard.tsx`** (edited): Tracks a card-expanded event with subscription name, category, and billing cycle when a user opens a card.
- **`app/subscriptions/[id].tsx`** (edited): Tracks a detail-viewed event with the subscription ID on screen mount.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | Fired on successful sign-in. Identifies the user and records the auth method. | `app/(auth)/sign-in.tsx` |
| `user_signed_up` | Fired after successful registration and verification. Identifies the user with first-seen date. | `app/(auth)/sign-up.tsx` |
| `user_signed_out` | Fired on logout. Resets the PostHog session. | `app/(tabs)/settings.tsx` |
| `subscription_card_expanded` | Fired when a subscription card is expanded to view details, with name, category, and billing cycle. | `app/components/SubscritpionCard.tsx` |
| `subscription_detail_viewed` | Fired when the subscription detail screen is opened, with the subscription ID. | `app/subscriptions/[id].tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1624057)
- [New sign-ups over time](/insights/Fs6pec4a)
- [Sign-ins over time](/insights/cXAhFbdK)
- [Sign-outs (churn signal) over time](/insights/dItPm1eF)
- [Subscription card engagement](/insights/ygRbMOPa)
- [Sign-up to sign-in conversion funnel](/insights/a3bnzm7S)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
