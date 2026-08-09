import { requireRole } from "@/lib/auth/session";
import prisma from "@/lib/dbClient/prisma";
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

const MembersPage = async () => {
  const session = await requireRole(["owner", "admin"]);
  const actor = session.user;
  const actorRole = actor.role ?? "member";

  const members = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Members</h1>
          <p className="text-muted-foreground text-sm">
            Create accounts and manage roles.
          </p>
        </div>
        <CreateUserDialog />
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
          {members.map((member) => {
            const memberRole = member.role ?? "member";
            const canManage = memberRole === "owner" && actorRole !== "owner";
            return (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>
                  <RoleSelect
                    userId={member.id}
                    role={memberRole}
                    disabled={canManage || actor.id === member.id}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <RemoveMemberButton
                    userId={member.id}
                    disabled={canManage || actor.id === member.id}
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
