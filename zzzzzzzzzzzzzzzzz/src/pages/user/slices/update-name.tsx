import { useEffect, useState } from "react"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { type UseFormReturn } from "react-hook-form"

import { useMutation } from "@tanstack/react-query"
import { updateUserOption } from "../query/options"
import queryClient from "@/query-client"
import userKeys from "../query/queryKeyFactory"
import { UserInterface } from "../types"

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import InputWithLoading from "@/components/custom-ui/input-with-loading"
import { CardForm, CardLayout, CardMainLayout, CardName } from "@user/layouts"

const schema = z.object({
	name: z.string().min(1, "Name must contain at least 1 character(s)"),
})

type schemaType = z.infer<typeof schema>

type UpdateNameFormFieldsProps = {
	form: UseFormReturn<schemaType>
	status: {
		isPending: boolean
	}
}

const UpdateNameFormFields: React.FC<UpdateNameFormFieldsProps> = ({
	form,
	status,
}) => {
	return (
		<>
			<FormField
				control={form.control}
				name="name"
				render={({ field }) => (
					<FormItem className="form-item">
						<FormLabel className="input-label">Username</FormLabel>
						<FormControl>
							<div>
								<InputWithLoading isLoading={status.isPending} {...field} />
							</div>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	)
}

const UpdateName = () => {
	const user = queryClient.getQueryData(userKeys.all) as UserInterface

	const form = useForm<schemaType>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: user?.name ? user.name : "",
		},
	})

	const {
		isError,
		isSuccess,
		isPending,
		status,
		reset,
		mutate: updateUserName,
	} = useMutation(updateUserOption())

	const onSubmit = async (values: schemaType) => {
		updateUserName(values)
	}

	const [statusText, setStatusText] = useState<string>("")

	useEffect(() => {
		if (status === "error") {
			setStatusText("Error while changing the name!")
		} else if (status === "success") {
			setStatusText("Name changed")
		} else {
			setStatusText("")
		}
	}, [status])

	return (
		<>
			<CardLayout>
				<CardName
					title="Profile Information"
					description="Update your account's profile information"
				/>
				<CardMainLayout>
					<CardForm
						form={form}
						onSubmit={onSubmit}
						status={{ isPending, isError, isSuccess }}
						statusText={statusText}
						reset={reset}
					>
						<UpdateNameFormFields form={form} status={{ isPending }} />
					</CardForm>
				</CardMainLayout>
			</CardLayout>
		</>
	)
}

export default UpdateName
