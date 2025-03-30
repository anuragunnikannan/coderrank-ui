import { NextResponse } from 'next/server'

export async function middleware(request) {
    if (request.nextUrl.pathname.startsWith("/home/admin")) {

        // if accessToken exists in cookies
        if (request.cookies.get("accessToken")) {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_PRIVATE_URL}/verify-admin`, {
                headers: {
                    "Authorization": `Bearer ${request.cookies.get("accessToken")["value"]}`
                }
            })

            if (!res?.ok) {
                return NextResponse.redirect(new URL("/home", request.url));
            }
            else {
                const data = await res.json();
                if (data?.is_admin)
                    return NextResponse.next();
                else
                    return NextResponse.redirect(new URL("/home", request.url));
            }
        }
        else {
            return NextResponse.redirect(new URL("/home", request.url));
        }
    }
    else {
        if (request.nextUrl.pathname.startsWith("/home")) {
            let response = NextResponse.next();

            // if user has clicked on "Try Now" generate guest_id
            if (!request.cookies.get("isLoggedIn") && !request.cookies.get("guest_id")) {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_PRIVATE_URL}/generate-guest-id`)
                const data = await res.json();
                console.log(data, res, res.status);
                response.cookies.set("guest_id", data?.guest_id);
            }
            return response;
        }
    }
}

export const config = {
    matcher: "/home/:path*"
}