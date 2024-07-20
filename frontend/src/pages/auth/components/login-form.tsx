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
		submit(values, { method: "POST", action: "" })
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
						<FormField
							control={form.control}
							name="remember"
							render={({ field }) => (
								<FormItem className="block mt-4">
									<FormControl>
										<label htmlFor="remember" className="flex items-center">
											<input
												type="checkbox"
												id="remember"
												name="remember"
												className="w-4 h-4 text-indigo-500 bg-white border-gray-300 rounded focus:ring-1"
											/>
											<span className="ms-2 text-sm text-gray-600">
												Remember Me
											</span>
										</label>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="auth-submit-section">
						<Link to="/forgot-password" className="btn-link">
							Forgot password?
						</Link>
						<button type="submit" className="btn-black ms-2">
							Log in
						</button>
					</div>
				</Form>
			</RHForm>
		</>
	)
}

export default LoginForm
