import Navbar from "../components/Navbar/Navbar";

export const metadata = {
	title: "CoderRank",
	description: "A programming platform for aspiring developers!",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>
				<Navbar></Navbar>
				{children}
			</body>
		</html>
	);
}