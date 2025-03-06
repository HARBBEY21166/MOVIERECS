"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { registerUser } from "@/lib/auth"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [debugInfo, setDebugInfo] = useState<Record<string, any>>({})
  const [testResult, setTestResult] = useState<string>("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Collect debug information
    const info = {
      apiUrl: process.env.NEXT_PUBLIC_API_URL || "Not set",
      nodeEnv: process.env.NODE_ENV,
      windowLocation: typeof window !== "undefined" ? window.location.href : "SSR",
      userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "SSR",
    }
    setDebugInfo(info)
    console.log("Debug info:", info)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      await registerUser({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
      })

      toast({
        title: "Registration successful",
        description: "Your account has been created. Please log in.",
      })

      router.push("/login")
    } catch (err) {
      console.error("Registration error:", err)
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // For testing purposes only - test API connectivity
  const testApiConnectivity = async () => {
    setIsLoading(true)
    setTestResult("")
    setError("")

    try {
      // First, try using the Next.js API route as a proxy
      const testUrl = "/api/test-connectivity"
      setTestResult(`Testing connectivity via Next.js API route: ${testUrl}...`)

      const response = await fetch(testUrl)
      const data = await response.json()

      setTestResult((prev) => `${prev}\nAPI test successful! Response: ${JSON.stringify(data)}`)

      toast({
        title: "API Test Successful",
        description: "Connection to the API was successful via Next.js API route.",
      })
    } catch (err) {
      console.error("API connectivity test error:", err)
      setTestResult((prev) => `${prev}\nAPI test failed: ${err instanceof Error ? err.message : String(err)}`)
      setError(`API connectivity test failed: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Enter your information to create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {process.env.NODE_ENV === "development" && (
              <Alert>
                <AlertDescription>
                  <details>
                    <summary>Debug Information</summary>
                    <pre className="mt-2 text-xs overflow-auto">{JSON.stringify(debugInfo, null, 2)}</pre>
                  </details>
                </AlertDescription>
              </Alert>
            )}

            {testResult && (
              <Alert>
                <AlertDescription>
                  <details open>
                    <summary>API Test Results</summary>
                    <pre className="mt-2 text-xs overflow-auto whitespace-pre-wrap">{testResult}</pre>
                  </details>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>

            {process.env.NODE_ENV === "development" && (
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2"
                onClick={testApiConnectivity}
                disabled={isLoading}
              >
                Test API Connectivity
              </Button>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

