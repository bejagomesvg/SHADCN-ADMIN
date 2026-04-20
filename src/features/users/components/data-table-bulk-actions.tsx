import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type Table } from '@tanstack/react-table'
import { Trash2, UserX, UserCheck, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { type User } from '../data/schema'
import {
  markUsersAsInvited,
  updateUsersStatus,
  usersQueryKey,
} from '../data/users'
import { UsersMultiDeleteDialog } from './users-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const queryClient = useQueryClient()
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedIds = selectedRows.map((row) => (row.original as User).id)

  const statusMutation = useMutation({
    mutationFn: ({
      ids,
      status,
    }: {
      ids: string[]
      status: 'active' | 'inactive'
    }) => updateUsersStatus(ids, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: usersQueryKey })
      table.resetRowSelection()
      toast.success(
        `${variables.status === 'active' ? 'Activated' : 'Deactivated'} ${selectedIds.length} user${selectedIds.length > 1 ? 's' : ''}`
      )
    },
    onError: (error, variables) => {
      toast.error(
        error instanceof Error
          ? error.message
          : `Error ${variables.status === 'active' ? 'activating' : 'deactivating'} users`
      )
    },
  })

  const inviteMutation = useMutation({
    mutationFn: (ids: string[]) => markUsersAsInvited(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersQueryKey })
      table.resetRowSelection()
      toast.success(
        `Marked ${selectedIds.length} user${selectedIds.length > 1 ? 's' : ''} as invited`
      )
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Error inviting users')
    },
  })

  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    statusMutation.mutate({ ids: selectedIds, status })
  }

  const handleBulkInvite = () => {
    inviteMutation.mutate(selectedIds)
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='user'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={handleBulkInvite}
              disabled={inviteMutation.isPending || statusMutation.isPending}
              className='size-8'
              aria-label='Invite selected users'
              title='Invite selected users'
            >
              <Mail />
              <span className='sr-only'>Invite selected users</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Invite selected users</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('active')}
              disabled={inviteMutation.isPending || statusMutation.isPending}
              className='size-8'
              aria-label='Activate selected users'
              title='Activate selected users'
            >
              <UserCheck />
              <span className='sr-only'>Activate selected users</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Activate selected users</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('inactive')}
              disabled={inviteMutation.isPending || statusMutation.isPending}
              className='size-8'
              aria-label='Deactivate selected users'
              title='Deactivate selected users'
            >
              <UserX />
              <span className='sr-only'>Deactivate selected users</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Deactivate selected users</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              disabled={inviteMutation.isPending || statusMutation.isPending}
              className='size-8'
              aria-label='Delete selected users'
              title='Delete selected users'
            >
              <Trash2 />
              <span className='sr-only'>Delete selected users</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete selected users</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <UsersMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}
