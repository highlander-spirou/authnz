import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { CardLayout, CardName, CardMainLayout, CardForm } from "@user/layouts"
import { updatePasswordOption } from "@user/query/options"
import { useEffect, useState } from "react"
import { useForm, UseFormReturn } from "react-hook-form"
import { z } from "zod"

const schema = z
	.object({
		currentPassword: z
			.string()
			.min(8, "Password must contains at least 8 characters"),
		newPassword: z
			.string()
			.min(8, "Password must contains at least 8 characters"),
		passwordConfirm: z.string(),
	})
	.refine((data) => data.newPassword === data.passwordConfirm, {
		message: "Passwords don't match",
		path: ["passwordConfirm"],
	})

type schemaType = z.infer<typeof schema>

type UpdatePwdFormFieldsProps = {
	form: UseFormReturn<schemaType>
	status: {
		isPending: boolean
	}
}

const UpdatePwdFormFields: React.FC<UpdatePwdFormFieldsProps> = ({
	form,
	status,
}) => {
	return (
		<>
			<FormField
				control={form.control}
				name="currentPassword"
				render={({ field }) => (
					<FormItem className="form-item">
						<FormLabel className="input-label">Current Password</FormLabel>
						<FormControl>
							<input
								{...field}
								type="password"
								className="form-input-normal disabled:opacity-30"
								disabled={status.isPending}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="newPassword"
				render={({ field }) => (
					<FormItem className="form-item">
						<FormLabel className="input-label">New Password</FormLabel>
						<FormControl>
							<input
								{...field}
								type="password"
								className="form-input-normal disabled:opacity-30"
								disabled={status.isPending}
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
					<FormItem className="form-item">
						<FormLabel className="input-label">Confirm Password</FormLabel>
						<FormControl>
							<input
								{...field}
								type="password"
								className="form-input-normal disabled:opacity-30"
								disabled={status.isPending}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	)
}

const ChangePassword = () => {
	const form = useForm<schemaType>({
		resolver: zodResolver(schema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			passwordConfirm: "",
		},
	})

	const { isError, isSuccess, isPending, status, reset, mutate } = useMutation(
		updatePasswordOption()
	)

	const onSubmit = async (values: schemaType) => {
		const submitValues = {
			currentPassword: values.currentPassword,
			newPassword: values.newPassword,
		}
		mutate(submitValues)
	}

	const [statusText, setStatusText] = useState<string>("")

	useEffect(() => {
		if (status === "error") {
			setStatusText("Error while updating your password!")
		} else if (status === "success") {
			setStatusText("Password changed")
		} else {
			setStatusText("")
		}
	}, [status])

	return (
		<CardLayout>
			<CardName
				title="Update Password"
				description="Ensure your account is using a long, random password to stay secure."
			/>
			<CardMainLayout>
				<CardForm
					form={form}
					onSubmit={onSubmit}
					status={{ isPending, isError, isSuccess }}
					statusText={statusText}
					reset={reset}
				>
					<UpdatePwdFormFields form={form} status={{ isPending }} />
				</CardForm>
			</CardMainLayout>
		</CardLayout>
	)
}

export default ChangePassword
