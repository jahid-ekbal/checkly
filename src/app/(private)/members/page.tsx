"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PunishmentControls from "@/components/members/PunishmentControls";
import RemoveMemberButton from "@/components/members/RemoveMemberButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcnui/table";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth/auth-client";

type Member = {
  id: string;
  name: string;
  email: string;
  banned: boolean;
  banReason: string | null;
  banExpires: string | null;
};

const MembersPage = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [members, setMembers] = useState<Member[] | null>(null);

  const load = useCallback(async () => {
    try {
      const result = await apiFetch<{ members: Member[] }>("/api/members");
      setMembers(result.members);
    } catch {
      setMembers([]);
    }
  }, []);

  useEffect(() => {
    if (session && session.user.role !== "admin") {
      router.replace("/dashboard");
      return;
    }
    const fetchMembers = async () => {
      await load();
    };
    void fetchMembers();
  }, [session, router, load]);

  if (!session || session.user.role !== "admin") {
    return (
      <div className="text-muted-foreground rounded-lg border p-12 text-center">
        <p className="text-foreground font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Members</h1>
        <p className="text-muted-foreground text-sm">
          Manage members, timeouts, and bans.
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(members ?? []).map((member) => {
            const isSelf = session.user.id === member.id;
            return (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>
                  {member.banned ?
                    <span
                      className="bg-destructive/10 text-destructive inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                      title={member.banReason ?? undefined}>
                      {member.banExpires ?
                        `Banned until ${new Date(member.banExpires).toLocaleDateString()}`
                      : "Permanently banned"}
                    </span>
                  : <span className="bg-muted text-muted-foreground inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium">
                      Active
                    </span>
                  }
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <PunishmentControls
                      member={member}
                      disabled={isSelf}
                      onChanged={() => void load()}
                    />
                    <RemoveMemberButton
                      userId={member.id}
                      disabled={isSelf}
                      onChanged={() => void load()}
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </section>
  );
};

export default MembersPage;
