import axios from 'axios';
import Cookies from 'js-cookie';

export async function handleClientRequest() {
    try {
        const pathname = window.location.pathname; // Fetch the pathname directly
        console.log("Current pathname:", pathname);

        if (pathname.startsWith("/home/admin")) {
            console.log("Admin route detected");
            const accessToken = Cookies.get("accessToken");
            console.log("Access token:", accessToken);

            if (!accessToken) {
                console.log("No access token found, redirecting to /home");
                window.location.href = "/home";
                return;
            }

            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/verify-admin`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            console.log("Admin verification response:", res);

            if (res.status !== 200 || !res.data?.is_admin) {
                console.log("Admin verification failed, redirecting to /home");
                window.location.href = "/home";
            } else {
                console.log("Admin verification successful");
            }
        } else if (pathname.startsWith("/home")) {
            console.log("Home route detected");
            const isLoggedIn = Cookies.get("isLoggedIn");
            const guestId = Cookies.get("guest_id");
            console.log("Is logged in:", isLoggedIn);
            console.log("Guest ID:", guestId);

            if (!isLoggedIn && !guestId) {
                console.log("No user session found, generating guest ID");
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/generate-guest-id`);
                console.log("Guest ID generation response:", res);

                if (res.status === 200 && res.data?.guest_id) {
                    Cookies.set("guest_id", res.data.guest_id);
                    console.log("Guest ID set in cookies:", res.data.guest_id);
                }
            }
        }
    } catch (error) {
        console.error("Error in handleClientRequest:", error);
        window.location.href = "/home";
    }
}
