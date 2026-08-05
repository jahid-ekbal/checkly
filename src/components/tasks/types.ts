export type TaskItem = {
  id: string;
  title: string;
  description: string | null;
  done: boolean;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate: string | null;
  effortHours: number | null;
  image: string | null;
  assignee: {
    id: string;
    name: string;
    username: string | null;
    image: string | null;
  } | null;
  labels: { id: string; name: string; color: string }[];
  createdAt: string;
  activity: {
    id: string;
    type: string;
    createdAt: string;
    actor: { id: string; name: string };
  }[];
};

export type Member = { id: string; name: string; username: string | null };
export type Label = { id: string; name: string; color: string };
