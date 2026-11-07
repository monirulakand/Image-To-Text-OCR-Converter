'use client';

import {Navbar, Container} from 'react-bootstrap';

export default function MenuBar() {
    return (
        <Navbar className="sticky-top px-4" expand="lg">
            <Container fluid>
                <Navbar.Brand href="#" className="d-flex align-items-center gap-2">
                    <span className="text-white fw-bold tracking-wide"
                          style={{letterSpacing: '1px', fontSize: '1.1rem'}}>
                        <span style={{color: '#6366f1'}}>OCR VISION</span>
                    </span>
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
}