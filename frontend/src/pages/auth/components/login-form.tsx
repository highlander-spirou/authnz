import {
	Form as RHForm,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, Link, useSubmit } from "react-router-dom"
import { z } from "zod"

const LoginForm = () => {
	const submit = useSubmit()

	const formSchema = z.object({
		email: z.string().email(),
		password: z.string().min(8, "Password must contains at least 8 characters"),
		remember: z.boolean().default(false).optional(),
	})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
			remember: false,
		},
	})
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		submit({ formData: JSON.stringify(values) }, { method: "POST", action: "" })
		form.resetField("password")
	}
	return (
		<>
			<RHForm {...form}>
				<Form onSubmit={form.handleSubmit(onSubmit)}>
					<div>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="input-label">Email</FormLabel>
									<FormControl>
										<input {...field} className="form-input-normal" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem className="mt-4">
									<FormLabel className="input-label">Password</FormLabel>
									<FormControl>
										<input
											{...field}
											type="password"
											className="form-input-normal"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-end items-center mt-5">
							<Link
								to="/forgot-password"
								className="btn-link inline-flex justify-end"
							>
								Forgot password?
							</Link>
						</div>
					</div>
					<button type="submit" className="btn-black mt-5 w-full">
						Log in
					</button>
				</Form>
			</RHForm>
		</>
	)
}

export default LoginForm
