import { useEffect, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { sendVerifyEmailOption } from "@auth/query/options"
import { AxiosError } from "axios"

import { CardMainLayout } from "@user/layouts"
import LoadingOpaque from "@/components/loading-opaque"
import SuccessStateButton from "@user/components/success-state-button"

const SendVerifyEmail = () => {
	const [statusText, setStatusText] = useState<string>("")

	const { error, isError, isPending, isSuccess, mutate, reset } = useMutation<
		any,
		AxiosError<any, { message: string }>
	>(sendVerifyEmailOption())

	useEffect(() => {
		setStatusText(error?.response?.data.message)
	}, [error])

	useEffect(() => {
		setStatusText(
			"A new verification link has been sent to your email address."
		)
	}, [isSuccess])

	return (
		<>
			<CardMainLayout>
				<LoadingOpaque isLoading={isPending}>
					<div>
						<h2 className="flex gap-3 items-center text-red-500 font-medium text-lg">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="w-5 h-5 fill-red-500"
								viewBox="0 0 16 16"
							>
								<path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2zm3.708 6.208L1 11.105V5.383zM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2z" />
								<path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1.5a.5.5 0 0 1-1 0V11a.5.5 0 0 1 1 0m0 3a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0" />
							</svg>
							Your email address is unverified.
						</h2>
						<p className="text-sm text-gray-800 mt-5">
							You must verify your primary email to:
						</p>
						<ul className="text-sm text-gray-800 list-disc list-inside grid md:grid-cols-2">
							<li className="mt-1.5">Change password</li>
							<li className="mt-1.5">Multi-factor Authentication (MFA)</li>
							<li className="mt-1.5">Biometrics Authentication</li>
							<li className="mt-1.5">Join teams</li>
						</ul>
						<div className="mt-5 ">
							{isSuccess && (
								<SuccessStateButton statusText={statusText} reset={reset} />
							)}
							{isError && <p className="user-status-error">{statusText}</p>}
							<button
								className="btn-black mt-3"
								onClick={() => mutate()}
								disabled={isPending}
							>
								Verify
							</button>
						</div>
					</div>
				</LoadingOpaque>
			</CardMainLayout>
		</>
	)
}

export default SendVerifyEmail
