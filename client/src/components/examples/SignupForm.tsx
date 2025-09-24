import { SignupForm } from '../SignupForm'
import { ThemeProvider } from '../ThemeProvider'

export default function SignupFormExample() {
  return (
    <ThemeProvider>
      <div className="p-4">
        <SignupForm />
      </div>
    </ThemeProvider>
  )
}