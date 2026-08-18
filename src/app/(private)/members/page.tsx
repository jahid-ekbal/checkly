"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreateUserDialog from "@/components/members/CreateUserDialog";
import RoleSelect from "@/components/members/RoleSelect";
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
  role: string;
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Members</h1>
          <p className="text-muted-foreground text-sm">
            Create accounts and manage roles.
          </p>
        </div>
        <CreateUserDialog onChanged={() => void load()} />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
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
                  <RoleSelect
                    userId={member.id}
                    role={member.role}
                    disabled={isSelf}
                    onChanged={() => void load()}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <RemoveMemberButton
                    userId={member.id}
                    disabled={isSelf}
                    onChanged={() => void load()}
                  />
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
