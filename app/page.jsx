import Image from "next/image";
import styles from "./page.module.css";
import { Box, Typography } from "@mui/material";
import Typing from "./components/Typing/Typing";
import Buttons from "./components/Buttons/Buttons";

const page = () => {

    return (
        <>
            <Box className={styles.container} sx={{ backgroundColor: "background", color: "textColor" }}>
                <Box className={styles.hero}>
                    <Box className={styles.heroText}>
                        <Typography variant="h2" fontWeight={900}>CoderRank</Typography>
                        <Typography variant="h4">
                            <Typing />
                        </Typography>
                        <Typography>
                            Learn to code, solve real-world problems, and join a global
                            community.
                        </Typography>

                        <Box className={styles.btn_container}>
                            <Buttons />
                        </Box>
                    </Box>

                    <Box className={styles.illustration}>
                        <Image src={"/illustration.svg"} height={400} width={400}></Image>
                    </Box>
                </Box>

                <Box className={styles.section}>
                    <Box className={styles.section_header}>
                        <Typography variant="h4" fontWeight={900}>Salient Features</Typography>
                        <Typography>For beginners to pros, we've got everything you need to grow.</Typography>
                    </Box>

                    <Box className={styles.cards}>
                        <Box className={styles.card} sx={{ backgroundColor: "secondaryBackground" }}>
                            <Typography variant="h5" fontWeight={"bold"}>Highly Modular</Typography>
                            <Typography>Customize the platform according to your needs.</Typography>
                        </Box>

                        <Box className={styles.card} sx={{ backgroundColor: "secondaryBackground" }}>
                            <Typography variant="h5" fontWeight={"bold"}>Vast Language Support</Typography>
                            <Typography>Supports all major programming languages, with a future scope to add more</Typography>
                        </Box>

                        <Box className={styles.card} sx={{ backgroundColor: "secondaryBackground" }}>
                            <Typography variant="h5" fontWeight={"bold"}>Open-Source</Typography>
                            <Typography>For all the developers out there, tinker as you like</Typography>
                        </Box>
                    </Box>
                </Box>

                <Box className={styles.section}>
                    <Box className={styles.section_header}>
                        <Typography variant="h4" fontWeight={900}>Supported Languages</Typography>
                    </Box>
                    <Box className={styles.cards}>
                        <Box className={styles.card} sx={{ backgroundColor: "secondaryBackground" }}>
                            <Typography variant="h5" fontWeight={"bold"}>Java</Typography>
                            <Typography>Java is a versatile, object-oriented programming language designed for cross-platform compatibility and high performance.</Typography>
                        </Box>

                        <Box className={styles.card} sx={{ backgroundColor: "secondaryBackground" }}>
                            <Typography variant="h5" fontWeight={"bold"}>Python</Typography>
                            <Typography>Python is a dynamic, high-level programming language known for its simplicity, readability, and versatility in various domains.</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box >
        </>
    )

}

export default page;
