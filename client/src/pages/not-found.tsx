import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 text-center">
      <div className="flex max-w-md flex-col items-center gap-4">
        <div className="text-primary font-heading text-6xl font-bold">404</div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Page Not Found
        </h1>
        <p className="text-sm text-muted-foreground">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have
          been moved or deleted.
        </p>
        <Button className="mt-4" size="lg">
          <Link to="/">Go back home</Link>
        </Button>
      </div>
    </div>
  );
}
