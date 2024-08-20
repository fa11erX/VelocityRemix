import { logout } from "@/services/auth.server"
import { ActionFunctionArgs } from "@remix-run/node"
import { redirect } from "@remix-run/react"

export async function loader() {
	return redirect('/')
}

export async function action({ request }: ActionFunctionArgs) {
	return logout({ request })
}