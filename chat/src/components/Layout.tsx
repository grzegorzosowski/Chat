import NavBar from './NavBar'
import { Box } from '@mui/material'
import Footer, { FOOTER_HEIGHT } from './Footer';

export default function Layout({ children }: React.PropsWithChildren<unknown>) {
    return (
        <>
            <Box sx={{ minHeight: `calc(100vh - ${FOOTER_HEIGHT}px)` }}>
                <header>
                    <NavBar />
                </header>
                <main>
                    <Box>
                        {children}
                    </Box>
                </main>
            </Box>
            <footer>
                <Footer />
            </footer>
        </>
    )
}
