"use client";

import {
  useCallback,
  useEffect,
  useState,
  useOptimistic,
  useTransition,
} from "react";
import { PlusIcon, TagsIcon } from "lucide-react";
import { Button } from "@/components/shadcnui/button";
import { Checkbox } from "@/components/shadcnui/checkbox";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcnui/avatar";
import { toast } from "@/components/shadcnui/toast";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth/auth-client";
import TaskFormDialog from "./TaskFormDialog";
import TaskDetailDrawer from "./TaskDetailDrawer";
import LabelDialog from "./LabelDialog";
import { priorityMeta } from "./priority";
import type { TaskItem, Member, Label } from "./types";

type TasksData = {
  tasks: TaskItem[];
  labels: Label[];
  members: Member[];
};

const TasksClient = () => {
  const [data, setData] = useState<TasksData | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [labelsOpen, setLabelsOpen] = useState(false);
  const [, startTransition] = useTransition();

  const { data: session } = authClient.useSession();
  const canManageLabels = session?.user.role === "admin";

  const load = useCallback(async () => {
    try {
      const result = await apiFetch<TasksData>("/api/tasks");
      setData(result);
    } catch {
      toast.add({
        title: "Could not load tasks",
        description: "Something went wrong.",
      });
    }
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      await load();
    };
    void fetchTasks();
  }, [load]);

  const [optimisticTasks, setOptimisticDone] = useOptimistic(
    data?.tasks ?? [],
    (state, { id, done }: { id: string; done: boolean }) =>
      state.map((task) => (task.id === id ? { ...task, done } : task)),
  );

  const toggleDone = (task: TaskItem) => {
    const next = !task.done;
    startTransition(() => {
      setOptimisticDone({ id: task.id, done: next });
    });
    void apiFetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      body: JSON.stringify({ done: next }),
    }).catch(() => {
      void load();
    });
  };

  const handleDelete = async (taskId: string) => {
    setSelectedTask(null);
    try {
      await apiFetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    } catch (err) {
      toast.add({
        title: "Delete failed",
        description:
          err instanceof Error ? err.message : "Something went wrong",
      });
      return;
    }
    toast.add({ title: "Task deleted", description: "The task was removed." });
    void load();
  };

  const editFormTask =
    editingTask ?
      {
        id: editingTask.id,
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        dueDate: editingTask.dueDate,
        effortHours: editingTask.effortHours,
        assigneeId: editingTask.assignee?.id ?? null,
        labelIds: editingTask.labels.map((label) => label.id),
        image: editingTask.image,
      }
    : null;

  if (!data) {
    return (
      <div className="text-muted-foreground rounded-lg border p-12 text-center">
        <p className="text-foreground font-medium">Loading tasks...</p>
      </div>
    );
  }

  const { labels, members } = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground text-sm">
            {optimisticTasks.length} task
            {optimisticTasks.length === 1 ? "" : "s"} in your workspace
          </p>
        </div>
        <div className="flex items-center gap-2">
          {canManageLabels && (
            <Button
              variant="outline"
              onClick={() => setLabelsOpen(true)}>
              <TagsIcon />
              Labels
            </Button>
          )}
          <Button onClick={() => setCreateOpen(true)}>
            <PlusIcon />
            New task
          </Button>
        </div>
      </div>

      {optimisticTasks.length === 0 ?
        <div className="text-muted-foreground rounded-lg border p-12 text-center">
          <p className="text-foreground font-medium">No tasks yet</p>
          <p className="text-sm">Create your first task to get started.</p>
        </div>
      : <div className="divide-y rounded-lg border">
          {optimisticTasks.map((task) => {
            const priority = priorityMeta[task.priority];
            return (
              <div
                key={task.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedTask(task)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") setSelectedTask(task);
                }}
                className="hover:bg-muted/50 flex cursor-pointer items-center gap-3 p-4 transition-colors">
                <Checkbox
                  checked={task.done}
                  onCheckedChange={(checked) => {
                    if (typeof checked === "boolean") toggleDone(task);
                  }}
                  onClick={(event) => event.stopPropagation()}
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate font-medium ${
                      task.done ? "text-muted-foreground line-through" : ""
                    }`}>
                    {task.title}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${priority.className}`}>
                      {priority.label}
                    </span>
                    {task.labels.map((label) => (
                      <span
                        key={label.id}
                        className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs"
                        style={{
                          borderColor: label.color,
                          backgroundColor: `${label.color}1a`,
                        }}>
                        <span
                          className="size-1.5 rounded-full"
                          style={{ backgroundColor: label.color }}
                        />
                        {label.name}
                      </span>
                    ))}
                    {task.dueDate && (
                      <span className="text-muted-foreground text-xs">
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    {task.effortHours != null && (
                      <span className="text-muted-foreground text-xs">
                        {task.effortHours}h
                      </span>
                    )}
                  </div>
                </div>
                {task.assignee && (
                  <span className="text-muted-foreground hidden items-center gap-2 text-sm sm:flex">
                    <Avatar className="size-6">
                      {task.assignee.image && (
                        <AvatarImage
                          src={task.assignee.image}
                          alt={task.assignee.name}
                        />
                      )}
                      <AvatarFallback className="text-[10px]">
                        {task.assignee.name
                          .split(" ")
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {task.assignee.name}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      }

      <TaskFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        members={members}
        labels={labels}
        onSaved={() => void load()}
      />

      <TaskFormDialog
        open={editingTask !== null}
        onOpenChange={(open) => {
          if (!open) setEditingTask(null);
        }}
        task={editFormTask}
        members={members}
        labels={labels}
        onSaved={() => void load()}
      />

      <TaskDetailDrawer
        task={selectedTask}
        open={selectedTask !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedTask(null);
        }}
        onEdit={() => {
          if (selectedTask) {
            setEditingTask(selectedTask);
            setSelectedTask(null);
          }
        }}
        onDelete={() => {
          if (selectedTask) void handleDelete(selectedTask.id);
        }}
        canEdit
        canDelete
      />

      <LabelDialog
        open={labelsOpen}
        onOpenChange={setLabelsOpen}
        labels={labels}
        onChanged={() => void load()}
      />
    </div>
  );
};

export default TasksClient;
