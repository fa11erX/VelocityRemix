import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="font-sans p-4">
      <ModeToggle />
      <Button variant="outline">Button</Button>
    </div>
  );
}
