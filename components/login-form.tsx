"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "@/schemas/auth";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginSchema) => {
    const { error } = await supabase.auth.signInWithPassword(values);

    if (error) {
      toast.error(error.message);
      form.setError("root", { message: error.message });
      return;
    }

    toast.success("Logged in successfully");
    router.push("/home");
    router.refresh();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials to continue</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input {...form.register("email")} />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input type="password" {...form.register("password")} />
              {form.formState.errors.password && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.password.message}
                </p>
              )}
            </Field>
            <Field>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full"
              >
                {form.formState.isSubmitting ? "Logging in..." : "Login"}
              </Button>

              <Button variant="outline" type="button">
                Login with Google
              </Button>
              <FieldDescription className="text-center">
                Don&apos;t have an account? <a href="/signup">Sign up</a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
