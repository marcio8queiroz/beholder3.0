import SideBar from "../components/SideBar"

export default function TemplatePage({ children }) {
    return (
        <>
            <SideBar />
            <main className="content">
                {children}
            </main>
        </>
    )
}