export const brand = {
  name: "Checkly",
  tagline: "Workspace operations, simplified.",
  description:
    "Manage tasks, members, and workspace settings from one clean dashboard.",
  hero: {
    headline: "Your workspace, under control.",
    subheadline:
      "Checkly keeps your tasks and team in one secure place. Assign work, track progress, and stay on top of everything.",
  },
  features: [
    {
      title: "Task management",
      description:
        "Create, assign, and complete tasks with priorities, labels, due dates, and effort estimates.",
    },
    {
      title: "Member safety",
      description:
        "Admins can timeout or ban members and lift punishments anytime.",
    },
    {
      title: "Team management",
      description:
        "Manage your team, apply timeouts and bans, and remove members in a few clicks.",
    },
    {
      title: "Secure sessions",
      description:
        "Password-protected accounts with remember-me session control.",
    },
  ],
  footer: {
    description:
      "Checkly is a fullstack task and workspace management app, built with Next.js, Better Auth, and Prisma.",
  },
} as const;

export type Feature = (typeof brand.features)[number];
