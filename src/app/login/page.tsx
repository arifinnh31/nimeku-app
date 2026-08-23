import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Login Administrator - NimeKu",
  description: "Masuk ke panel pengelolaan katalog dan episode NimeKu",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

