import {
	Form as RHForm,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form"
import { formSerialize } from "@/lib/form-serializer"
import ErrorSection from "@auth/components/error-section"
import { resetPassword } from "@auth/query/fetcher"
import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import {
	Form,
	Link,
	redirect,
	useRouteError,
	useSubmit,
} from "react-router-dom"
import { z } from "zod"

export const action = async ({ request, params }) => {
	try {
		const { token } = params
		const resetForm = await formSerialize(request)
		await resetPassword(token, resetForm)
		return redirect("/login")
	} catch (error) {
		if (error instanceof AxiosError) {
			throw new Error(error.response?.data)
		} else {
			throw new Error("Unknown error")
		}
	}
}

const ResetPassword = () => {
	const submit = useSubmit()

	const formSchema = z
		.object({
			password: z
				.string()
				.min(8, "Password must contains at least 8 characters"),
			passwordConfirm: z.string(),
		})
		.refine((data) => data.password === data.passwordConfirm, {
			message: "Passwords don't match",
			path: ["passwordConfirm"],
		})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			password: "",
			passwordConfirm: "",
		},
	})

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		submit({ password: values.password }, { method: "POST", action: "" })
	}

	const error = useRouteError() as Error

	return (
		<>
			<div className="w-full h-screen">
				<nav className="nav-bar">
					<div className="nav-bar-restrict-grow">
						<Link to="/" className="logo-wrapper h-16">
							<svg
								viewBox="0 0 48 48"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								className="block h-9 w-auto"
							>
								<path
									d="M11.395 44.428C4.557 40.198 0 32.632 0 24 0 10.745 10.745 0 24 0a23.891 23.891 0 0113.997 4.502c-.2 17.907-11.097 33.245-26.602 39.926z"
									fill="#6875F5"
								></path>
								<path
									d="M14.134 45.885A23.914 23.914 0 0024 48c13.255 0 24-10.745 24-24 0-3.516-.756-6.856-2.115-9.866-4.659 15.143-16.608 27.092-31.75 31.751z"
									fill="#6875F5"
								></path>
							</svg>
						</Link>
					</div>
				</nav>
				<div className="w-full mt-40 flex flex-col justify-center items-center gap-5">
					<div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
						<h1 className="mb-5 text-center text-xl font-semibold">
							Reset your password
						</h1>
						<ErrorSection errors={error.message} />
						<RHForm {...form}>
							<Form onSubmit={form.handleSubmit(onSubmit)}>
								<div className="flex flex-col gap-5">
									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="input-label">
													New Password
												</FormLabel>
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
										name="passwordConfirm"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="input-label">
													Confirm Password
												</FormLabel>
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
								</div>
								<div className="auth-submit-section">
									<button type="submit" className="btn-black ms-2">
										Reset Password
									</button>
								</div>
							</Form>
						</RHForm>
					</div>
				</div>
			</div>
		</>
	)
}

export default ResetPassword
