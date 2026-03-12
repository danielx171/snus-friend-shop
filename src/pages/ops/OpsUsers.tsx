import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Shield, ShieldOff, Users, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthUser {
  id: string;
  email: string | null;
  created_at: string;
  roles: string[];
}

interface UsersResponse {
  users: AuthUser[];
  page: number;
  perPage: number;
}

export default function OpsUsers() {
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['ops-users', page],
    queryFn: () =>
      apiFetch<UsersResponse>('ops-users', { params: { page: String(page), per_page: '50' } }),
  });

  const mutation = useMutation({
    mutationFn: (vars: { user_id: string; role: string; action: 'grant' | 'revoke' }) =>
      apiFetch<{ ok: boolean; message: string }>('ops-set-role', {
        method: 'POST',
        body: vars,
      }),
    onSuccess: (res) => {
      toast({ title: 'Success', description: res.message });
      queryClient.invalidateQueries({ queryKey: ['ops-users'] });
    },
    onError: (err: Error) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex items-center gap-4 px-4 py-3">
          <Link to="/ops" className="text-sm text-muted-foreground hover:text-foreground">← Dashboard</Link>
          <h1 className="text-lg font-semibold flex items-center gap-2"><Users className="h-5 w-5" /> User Management</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-4">
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive text-sm">
            Failed to load users: {(error as Error).message}
          </div>
        )}

        {data && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.users.map((user) => {
                  const isAdmin = user.roles.includes('admin');
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email ?? '—'}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {user.roles.length === 0 && <span className="text-muted-foreground text-xs">none</span>}
                          {user.roles.map((r) => (
                            <Badge key={r} variant={r === 'admin' ? 'default' : 'secondary'}>{r}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {isAdmin ? (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={mutation.isPending}
                            onClick={() => mutation.mutate({ user_id: user.id, role: 'admin', action: 'revoke' })}
                          >
                            <ShieldOff className="h-3.5 w-3.5 mr-1" /> Remove admin
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="default"
                            disabled={mutation.isPending}
                            onClick={() => mutation.mutate({ user_id: user.id, role: 'admin', action: 'grant' })}
                          >
                            <Shield className="h-3.5 w-3.5 mr-1" /> Make admin
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-muted-foreground">Page {data.page}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={data.users.length < data.perPage}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
