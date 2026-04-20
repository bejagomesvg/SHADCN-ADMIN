import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { IconFacebook, IconGithub } from '@/assets/brand-icons'
import { normalizeAuthRedirect } from '@/features/auth/lib/redirect'
import { useAuthStore } from '@/stores/auth-store'
import { buildAuthUserFromSession } from '@/features/auth/lib/session'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { supabase } from '@/utils/supabase'

const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Please enter your email.' : undefined),
  }),
  password: z
    .string()
    .min(1, 'Please enter your password.')
    .min(7, 'Password must be at least 7 characters long.'),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const navigate = useNavigate()
  const { auth } = useAuthStore()
  const safeRedirectTo = normalizeAuthRedirect(redirectTo)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      if (!supabase) {
        throw new Error(
          'Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY.'
        )
      }

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email.trim().toLowerCase(),
        password: data.password,
      })

      if (error) {
        throw new Error(error.message)
      }

      if (!authData.session) {
        throw new Error('Sessão não retornada pelo Supabase.')
      }

      const authUser = await buildAuthUserFromSession(authData.session)

      if (!authUser) {
        throw new Error(
          'Usuário autenticado, mas sem perfil correspondente em public.users.'
        )
      }

      auth.setUser(authUser)
      auth.setAccessToken(authData.session.access_token)
      auth.setInitialized(true)

      return authUser
    },
    onSuccess: (authUser) => {
      toast.success(`Welcome back, ${authUser.email}!`)
      navigate({ to: safeRedirectTo, replace: true })
      window.setTimeout(() => {
        if (window.location.pathname === '/sign-in') {
          window.location.replace(safeRedirectTo)
        }
      }, 50)
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao autenticar usuário.'
      )
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    mutation.mutate(data)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='absolute inset-e-0 -top-0.5 text-sm font-medium text-muted-foreground hover:opacity-75'
              >
                Forgot password?
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className='animate-spin' /> : <LogIn />}
          Sign in
        </Button>

        <div className='relative my-2'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background px-2 text-muted-foreground'>
              Or continue with
            </span>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-2'>
          <Button variant='outline' type='button' disabled={mutation.isPending}>
            <IconGithub className='h-4 w-4' /> GitHub
          </Button>
          <Button variant='outline' type='button' disabled={mutation.isPending}>
            <IconFacebook className='h-4 w-4' /> Facebook
          </Button>
        </div>
      </form>
    </Form>
  )
}
