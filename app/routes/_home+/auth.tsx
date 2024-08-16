import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});

export default function AuthRoute() {
  return (
    <div className="flex flex-1">
      <div className="flex flex-col items-center flex-1 flex-shrink-0 px-5 pt-16 pb-8 border-r">
        <div className="flex-1 flex flex-col justify-center w-[330px] sm:w-[384px]">
          <CreateAccountForm />
        </div>
      </div>
      <div className="flex-col items-center justify-center flex-1 flex-shrink hidden basis-1/4 xl:flex">
        Lorem ipsum
      </div>
    </div>
  );
}

function CreateAccountForm() {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission with validated values
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values); // Replace with actual form submission logic
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Adresse email" aria-label="Email Address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Your password" aria-label="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
