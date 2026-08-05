export const brand = {
  name: "Checkly",
  tagline: "Workspace operations, simplified.",
  description:
    "Manage tasks, members, and roles from one clean workspace dashboard.",
  hero: {
    headline: "Your workspace, under control.",
    subheadline:
      "Checkly keeps your tasks, team, and roles in one secure place. Assign work, track progress, and stay on top of everything.",
  },
  features: [
    {
      title: "Task management",
      description:
        "Create, assign, and complete tasks with priorities, labels, due dates, and effort estimates.",
    },
    {
      title: "Role-based access",
      description:
        "Owner, admin, member, and viewer roles with fine-grained permissions.",
    },
    {
      title: "Team management",
      description:
        "Create accounts, assign roles, and remove members in a few clicks.",
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
