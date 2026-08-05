"use client";

import { useState, useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, TagsIcon } from "lucide-react";
import { Button } from "@/components/shadcnui/button";
import { Checkbox } from "@/components/shadcnui/checkbox";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcnui/avatar";
import { toast } from "@/components/shadcnui/toast";
import {
  toggleTaskDoneAction,
  deleteTaskAction,
} from "@/server/actions/task-actions";
import TaskFormDialog from "./TaskFormDialog";
import TaskDetailDrawer from "./TaskDetailDrawer";
import LabelDialog from "./LabelDialog";
import { priorityMeta } from "./priority";
import type { TaskItem, Member, Label } from "./types";

type TasksClientProps = {
  tasks: TaskItem[];
  labels: Label[];
  members: Member[];
  canEdit: boolean;
  canManageLabels: boolean;
  currentUserId: string;
};

const TasksClient = ({
  tasks,
  labels,
  members,
  canEdit,
  canManageLabels,
}: TasksClientProps) => {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [labelsOpen, setLabelsOpen] = useState(false);
  const [, startTransition] = useTransition();

  const [optimisticTasks, setOptimisticDone] = useOptimistic(
    tasks,
    (state, { id, done }: { id: string; done: boolean }) =>
      state.map((task) => (task.id === id ? { ...task, done } : task)),
  );

  const toggleDone = (task: TaskItem) => {
    const next = !task.done;
    startTransition(() => {
      setOptimisticDone({ id: task.id, done: next });
    });
    void toggleTaskDoneAction(task.id, next).then((result) => {
      if (result.error) router.refresh();
    });
  };

  const handleDelete = async (taskId: string) => {
    setSelectedTask(null);
    const result = await deleteTaskAction(taskId);
    if (result.error) {
      toast.add({ title: "Delete failed", description: result.error });
      return;
    }
    toast.add({ title: "Task deleted", description: "The task was removed." });
    router.refresh();
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
          {canEdit && (
            <Button onClick={() => setCreateOpen(true)}>
              <PlusIcon />
              New task
            </Button>
          )}
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
                    {task.assignee.username ?
                      `@${task.assignee.username}`
                    : task.assignee.name}
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
      />

      <TaskFormDialog
        open={editingTask !== null}
        onOpenChange={(open) => {
          if (!open) setEditingTask(null);
        }}
        task={editFormTask}
        members={members}
        labels={labels}
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
        canEdit={canEdit}
        canDelete={canEdit}
      />

      <LabelDialog
        open={labelsOpen}
        onOpenChange={setLabelsOpen}
        labels={labels}
        onChanged={() => router.refresh()}
      />
    </div>
  );
};

export default TasksClient;
