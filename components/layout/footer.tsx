export function Footer() {
    return (
        <footer style={{ borderTop: '1px solid var(--line)', position: 'relative', zIndex: 1 }}>
            <div style={{ padding: '22px 56px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{
                    fontFamily: '"IM Fell English SC", serif',
                    letterSpacing: '0.16em',
                    fontSize: 10,
                    color: '#7a7058',
                    margin: 0,
                }}>
                    © MMXXV Mysterria Archive · A Lord of The Mysteries community project
                </p>
                <div style={{ display: 'flex', gap: 24 }}>
                    {['ikeepcalm', 'Esfer', 'Djecka'].map(name => (
                        <a
                            key={name}
                            href="https://api.mysterria.net/archive/mvc"
                            className="footer-link"
                        >
                            {name}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    )
}
