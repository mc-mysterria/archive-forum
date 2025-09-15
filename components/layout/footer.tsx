export function Footer() {
    return (
        <footer className="border-t">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © 2025 Mysterria Archive. A Lord of The Mysteries community project.
                    </p>
                    <div className="flex gap-6">
                        <a
                            href="https://api.mysterria.net/archive/mvc"
                            className="text-sm text-muted-foreground hover:text-primary"
                        >
                            ikeepcalm
                        </a>
                        <a
                            href="https://api.mysterria.net/archive/mvc"
                            className="text-sm text-muted-foreground hover:text-primary"
                        >
                            Esfer
                        </a>
                        <a
                            href="https://api.mysterria.net/archive/mvc"
                            className="text-sm text-muted-foreground hover:text-primary"
                        >
                            Djecka
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}