import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { signIn } from '@/api/sign-in'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Helmet } from 'react-helmet-async'
import { api } from '@/lib/axios'
import { APP_NAME } from '@/constants'

const signInForm = z.object({
  email: z.string().email(),
  password: z.string(),
})

type SignInForm = z.infer<typeof signInForm>

export function SignIn() {
  const [searhParams] = useSearchParams()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<SignInForm>({
    resolver: zodResolver(signInForm),
    defaultValues: {
      email: searhParams.get('email') ?? '',
      password: '',
    }
  })

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: signIn
  })

  async function handleSignIn({ email, password }: SignInForm) {
    try {
      const { accessToken } = await authenticate({ email, password })

      sessionStorage.setItem(`@${APP_NAME}:access-token`, accessToken)

      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

      toast.success('Bem vindo')

      navigate('/app')
    } catch (error) {
      toast.error('Credenciais inválidas.')
    }
  }

  return <>
    <Helmet title="Login" />
    <div className="p-8" >
      {/* <Button asChild className='absolute right-8 top-8' variant='ghost' >
        <Link to='/sign-up'>
          Cadastrar-se
        </Link>
      </Button> */}

      <div className="w-[350px] flex flex-col justify-center gap-6" >
        <div className="flex flex-col gap-2 text-center" >
          <h1 className="text-2xl font-semibold tracking-tight" >
            Acessar painel
          </h1>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(handleSignIn)} >
          <div className="space-y-2" >
            <Label htmlFor="email" >Seu e-mail</Label>
            <Input id='email' type='email' {...register('email')} />
          </div>

          <div className="space-y-2" >
            <Label htmlFor="password" >Sua senha</Label>
            <Input id='password' type='password' {...register('password')} />
          </div>

          <Button
            type='submit'
            className="w-full"
            disabled={isSubmitting}
          >
            Acessar painel
          </Button>
        </form>
      </div>
    </div>
  </>
}