'use client';

import {useState, useRef} from 'react';
import {Container, Row, Col, Spinner, Toast, ToastContainer} from 'react-bootstrap';

import {LANGUAGES} from './languages';

const PLACEHOLDER_IMAGE = '/images/imagePlaceholder.svg';

const enterAnimation = {
    className: 'animate__animated animate__fadeInUp',
    style: {animationDuration: '300ms'},
};

export default function ImageToText() {
    const [imgSrc, setImgSrc] = useState(PLACEHOLDER_IMAGE);
    const [ocrLang, setOcrLang] = useState('');
    const [ocrResult, setOcrResult] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [copied, setCopied] = useState(false);

    // File input ref to clear the file selector value on reset
    const fileInputRef = useRef(null);

    // Toast state
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const triggerToast = (msg) => {
        setToastMessage(msg);
        setShowToast(true);
    };

    const fileOnChange = (event) => {
        const imgFile = event.target.files?.[0];
        if (!imgFile) return;

        const reader = new FileReader();
        reader.onload = (e) => setImgSrc(e.target.result);
        reader.readAsDataURL(imgFile);
    };

    const langOnChange = (event) => setOcrLang(event.target.value);

    const doOCR = async () => {
        // Validation: Check if image is selected
        if (imgSrc === PLACEHOLDER_IMAGE) {
            triggerToast('Please upload an image first.');
            return;
        }

        // Validation: Check if language is selected
        if (!ocrLang) {
            triggerToast('Please choose an AI language first.');
            return;
        }

        setHasSubmitted(true);
        setIsProcessing(true);
        setOcrResult('');
        let worker = null;

        try {
            const {createWorker} = await import('tesseract.js');
            worker = await createWorker(ocrLang);

            const {data} = await worker.recognize(imgSrc);
            setOcrResult(data.text || 'No legible text detected in image.');
        } catch (err) {
            console.error('OCR failed:', err);
            triggerToast('Neural processing failed.');
        } finally {
            if (worker) await worker.terminate();
            setIsProcessing(false);
        }
    };

    const copyToClipboard = () => {
        if (!ocrResult) return;
        navigator.clipboard.writeText(ocrResult);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleReset = () => {
        setImgSrc(PLACEHOLDER_IMAGE);
        setOcrLang('');
        setOcrResult('');
        setIsProcessing(false);
        setHasSubmitted(false);
        setCopied(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="main-wrapper">
            {/* Sleek AI Toast Notification Container */}
            <ToastContainer position="top-end" className="p-3" style={{zIndex: 1055}}>
                <Toast
                    onClose={() => setShowToast(false)}
                    show={showToast}
                    delay={3000}
                    autohide
                    className="ai-toast"
                >
                    <Toast.Header closeButton>
                        <strong className="me-auto">⚡ System Notice</strong>
                    </Toast.Header>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>

            <Container>
                <Row className="justify-content-center align-items-center g-4">
                    {/* Left Side: Upload & Control Card */}
                    <Col md={6} lg={5} sm={12}>
                        <div {...enterAnimation}>
                            <div className="input-div d-flex flex-column justify-content-between">
                                <div>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h6 className="card-label">IMAGE INPUT</h6>
                                        <span className="badge-tech">IMAGE TO TEXT</span>
                                    </div>
                                    <div className="preview-container">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img className="preview-img" src={imgSrc} alt="Preview"/>
                                    </div>
                                </div>

                                <div className="d-flex flex-column gap-2 mt-3">
                                    <input
                                        ref={fileInputRef}
                                        onChange={fileOnChange}
                                        className="form-control app-input"
                                        type="file"
                                        accept="image/*"
                                        aria-label="Upload image"
                                    />
                                    <select
                                        onChange={langOnChange}
                                        className="form-control app-input"
                                        aria-label="OCR language"
                                        value={ocrLang}
                                    >
                                        <option value="">Choose AI Model Language</option>
                                        {LANGUAGES.map((language) => (
                                            <option key={language.value} value={language.value}>
                                                {language.label}
                                            </option>
                                        ))}
                                    </select>

                                    <div className="d-flex gap-2 mt-1">
                                        <button
                                            onClick={doOCR}
                                            className="btn btn-ai flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? (
                                                'Processing Matrix...'
                                            ) : (
                                                <>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round">
                                                        <path
                                                            d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
                                                    </svg>
                                                    Extract Text with AI
                                                </>
                                            )}
                                        </button>

                                        {(hasSubmitted || imgSrc !== PLACEHOLDER_IMAGE || ocrLang) && (
                                            <button
                                                onClick={handleReset}
                                                className="btn btn-outline-secondary px-3"
                                                style={{
                                                    borderRadius: '10px',
                                                    fontSize: '13px',
                                                    borderColor: 'rgba(255,255,255,0.15)',
                                                    color: '#94a3b8'
                                                }}
                                                title="Reset Form"
                                                disabled={isProcessing}
                                            >
                                                Reset
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>

                    {/* Right Side: Dynamic Result Card (Shows loading spinner when processing) */}
                    {hasSubmitted && (
                        <Col md={6} lg={5} sm={12}>
                            <div {...enterAnimation}>
                                <div className="ocr-div d-flex flex-column position-relative">
                                    <div
                                        className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary border-opacity-25">
                                        <h6 className="card-label mb-0">EXTRACTED RESULT</h6>
                                        {!isProcessing && ocrResult && (
                                            <button
                                                onClick={copyToClipboard}
                                                className="btn-copy"
                                            >
                                                {copied ? '✓ Copied' : 'Copy Text'}
                                            </button>
                                        )}
                                    </div>

                                    {isProcessing ? (
                                        <div
                                            className="d-flex flex-column justify-content-center align-items-center flex-grow-1 py-4">
                                            <Spinner animation="border" role="status" className="ai-spinner mb-3">
                                                <span className="visually-hidden">Loading...</span>
                                            </Spinner>
                                            <p className="ai-loader-text">Analyzing image data...</p>
                                        </div>
                                    ) : (
                                        <div className="flex-grow-1 ocr-content animate__animated animate__fadeIn">
                                            {ocrResult}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Col>
                    )}
                </Row>
            </Container>
        </div>
    );
}
