import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardFooter, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <h3 className="text-lg font-semibold">Login</h3>
          </CardHeader>
          <CardContent>
            <form>
              <div className="mb-4">
                <label htmlFor="login" className="block text-sm font-medium text-gray-700">
                  Usuário
                </label>
                <Input type="text" id="login" placeholder="Digite seu login" className="mt-1" />
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <Input type="password" id="password" placeholder="Digite sua senha" className="mt-1" />
              </div>
             {/* <Link className={buttonVariants({ variant: "outline" })} href="/dashboard">Click here</Link>*/}
              <Button asChild>
  <Link href="/dashboard">Entrar</Link>
</Button>

            
            </form>
          </CardContent>
          <CardFooter className="text-center">
          
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
