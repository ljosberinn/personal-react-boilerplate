// eslint-disable-next-line spaced-comment
/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * string joined by `,` - containing all currently enabled provider
     *
     * @example
     * ```sh
     * facebook,github,discord,google
     * ```
     */
    readonly NEXT_PUBLIC_ENABLED_PROVIDER: string;

    readonly DISCORD_CLIENT_SECRET: string;
    readonly DISCORD_CLIENT_ID: string;

    readonly GITHUB_CLIENT_ID: string;
    readonly GITHUB_CLIENT_SECRET: string;

    readonly GOOGLE_CLIENT_ID: string;
    readonly GOOGLE_CLIENT_SECRET: string;

    readonly FACEBOOK_CLIENT_ID: string;
    readonly FACEBOOK_CLIENT_SECRET: string;

    /**
     * session lifetime in seconds
     *
     * @default 28800 seconds
     * @default 8 hours
     */
    readonly NEXT_PUBLIC_SESSION_LIFETIME: string;

    /**
     * string joined by `,` - containing all currently enabled languages
     */
    readonly NEXT_PUBLIC_ENABLED_LANGUAGES: string;

    /**
     * the fallback language used if:
     * - the users language cannot be inferred
     * - the users language is not supported
     *
     * MUST BE INCLUDED IN ENABLED_LANGUAGES
     *
     * @default en
     */
    readonly NEXT_PUBLIC_FALLBACK_LANGUAGE: string;

    /**
     * Sentry API endpoint for this project
     */
    readonly NEXT_PUBLIC_SENTRY_DSN: string;
  }
}
