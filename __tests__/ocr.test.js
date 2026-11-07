import { render, screen } from '@testing-library/react';

import ImageToTextPage from '@/components/ImageToTextPage';
import { LANGUAGES } from '@/components/languages';

describe('ImageToTextPage', () => {
  it('renders the navbar brand', () => {
    render(<ImageToTextPage />);
    expect(screen.getByAltText('OCR')).toBeInTheDocument();
  });

  it('renders the OCR controls', () => {
    render(<ImageToTextPage />);

    expect(screen.getByRole('button', { name: /do ocr/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByLabelText(/upload image/i)).toBeInTheDocument();
  });

  it('shows the placeholder result before any OCR run', () => {
    render(<ImageToTextPage />);
    expect(screen.getByText('.......')).toBeInTheDocument();
  });

  it('exposes every tesseract language in the dropdown', () => {
    render(<ImageToTextPage />);

    expect(screen.getByRole('option', { name: 'Choose Language' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'English' })).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(LANGUAGES.length + 1);
  });

  it('keeps language codes free of stray whitespace', () => {
    LANGUAGES.forEach(({ value }) => {
      expect(value).toBe(value.trim());
      expect(value).not.toBe('');
    });
  });
});
