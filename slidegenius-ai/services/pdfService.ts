import jsPDF from 'jspdf';
import { GeneratedPresentation, Theme } from '../types';

// --- Theme Configuration ---
interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
}

interface ThemeConfig {
  colors: ThemeColors;
  fontHeader: string;
  fontBody: string;
  layoutStyle: 'clean' | 'bold' | 'framed';
}

const getThemeConfig = (theme: Theme): ThemeConfig => {
  switch (theme) {
    case Theme.Modern:
      return {
        colors: { primary: '#2563EB', secondary: '#1E40AF', background: '#F8FAFC', text: '#1E293B', accent: '#60A5FA' },
        fontHeader: 'helvetica', fontBody: 'helvetica', layoutStyle: 'bold'
      };
    case Theme.Corporate:
      return {
        colors: { primary: '#0F172A', secondary: '#334155', background: '#FFFFFF', text: '#333333', accent: '#CBD5E1' },
        fontHeader: 'times', fontBody: 'helvetica', layoutStyle: 'clean'
      };
    case Theme.Creative:
      return {
        colors: { primary: '#7C3AED', secondary: '#DB2777', background: '#FFF1F2', text: '#4C1D95', accent: '#F472B6' },
        fontHeader: 'helvetica', fontBody: 'courier', layoutStyle: 'framed'
      };
    case Theme.Minimal:
    default:
      return {
        colors: { primary: '#18181B', secondary: '#71717A', background: '#FFFFFF', text: '#27272A', accent: '#E4E4E7' },
        fontHeader: 'helvetica', fontBody: 'helvetica', layoutStyle: 'clean'
      };
  }
};

// --- Helper Functions ---
const hexToRgb = (hex: string) => {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return { r, g, b };
};

export const createPDF = (data: GeneratedPresentation) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4', // 297mm x 210mm
  });

  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  const theme = getThemeConfig(data.theme);
  const { r: br, g: bg, b: bb } = hexToRgb(theme.colors.background);
  const { r: tr, g: tg, b: tb } = hexToRgb(theme.colors.text);
  const { r: pr, g: pg, b: pb } = hexToRgb(theme.colors.primary);
  const { r: sr, g: sg, b: sb } = hexToRgb(theme.colors.secondary);

  const setFillColorHex = (hex: string) => {
    const rgb = hexToRgb(hex);
    doc.setFillColor(rgb.r, rgb.g, rgb.b);
  };

  const setTextColorHex = (hex: string) => {
    const rgb = hexToRgb(hex);
    doc.setTextColor(rgb.r, rgb.g, rgb.b);
  };

  // --- Cover Slide ---
  setFillColorHex(theme.colors.primary);
  doc.rect(0, 0, width, height, 'F');

  // Background Image for Cover
  if (data.coverImageBase64) {
    try {
      doc.addImage(`data:image/png;base64,${data.coverImageBase64}`, 'PNG', 0, 0, width, height, undefined, 'FAST');
      // Overlay
      doc.setFillColor(0, 0, 0);
      doc.setGState(new doc.GState({ opacity: 0.5 }));
      doc.rect(0, 0, width, height, 'F');
      doc.setGState(new doc.GState({ opacity: 1.0 }));
    } catch (e) {
      console.warn("Could not add cover image", e);
    }
  }

  // Cover Text
  doc.setTextColor(255, 255, 255);
  doc.setFont(theme.fontHeader, 'bold');
  doc.setFontSize(36);
  
  const titleLines = doc.splitTextToSize(data.topic, width - 40);
  doc.text(titleLines, width / 2, height / 2 - 10, { align: 'center' });

  doc.setFontSize(14);
  doc.setFont(theme.fontBody, 'normal');
  doc.text("Created with SlideGenius AI", width / 2, height / 2 + 25, { align: 'center' });
  doc.text(new Date().toLocaleDateString('en-US'), width / 2, height / 2 + 35, { align: 'center' });

  // --- Content Slides ---
  data.slides.forEach((slide, index) => {
    doc.addPage();
    
    // 1. Background
    setFillColorHex(theme.colors.background);
    doc.rect(0, 0, width, height, 'F');

    // 2. Theme Decorations
    if (theme.layoutStyle === 'bold') {
      setFillColorHex(theme.colors.primary);
      doc.rect(0, 0, 15, height, 'F'); // Sidebar
    } else if (theme.layoutStyle === 'framed') {
      doc.setDrawColor(pr, pg, pb);
      doc.setLineWidth(2);
      doc.rect(10, 10, width - 20, height - 20);
    }

    // 3. Slide Title
    const titleX = theme.layoutStyle === 'bold' ? 25 : 20;
    setTextColorHex(theme.colors.primary);
    doc.setFont(theme.fontHeader, 'bold');
    doc.setFontSize(24);
    doc.text(slide.title, titleX, 25);
    
    // Separator Line
    doc.setDrawColor(sr, sg, sb);
    doc.setLineWidth(0.5);
    doc.line(titleX, 30, width - 20, 30);

    // 4. Layout Logic (Split vs Full)
    const hasImage = !!slide.imageBase64;
    const contentStartX = theme.layoutStyle === 'bold' ? 25 : 20;
    let contentWidth = width - 40;
    
    if (hasImage) {
      contentWidth = (width / 2) - 20;
      
      // Render Image (Right Side)
      try {
        const imgX = (width / 2) + 10;
        const imgY = 40;
        const imgW = (width / 2) - 30;
        const imgH = 110; // Fixed height area
        
        // Draw a subtle border/bg behind image
        setFillColorHex(theme.colors.accent);
        doc.rect(imgX - 2, imgY - 2, imgW + 4, imgH + 4, 'F');
        
        doc.addImage(
          `data:image/png;base64,${slide.imageBase64}`, 
          'PNG', 
          imgX, 
          imgY, 
          imgW, 
          imgH, 
          undefined, 
          'FAST'
        );
      } catch (e) {
        console.warn('Failed to render slide image');
      }
    }

    // 5. Render Bullet Points
    setTextColorHex(theme.colors.text);
    doc.setFont(theme.fontBody, 'normal');
    doc.setFontSize(14);
    
    let yPos = 45;
    slide.content.forEach((bullet) => {
        const bulletText = `• ${bullet}`;
        const lines = doc.splitTextToSize(bulletText, contentWidth);
        
        if (yPos + (lines.length * 7) > height - 20) return;

        doc.text(lines, contentStartX, yPos);
        yPos += (lines.length * 7) + 4;
    });

    // 6. Footer Note
    if (slide.footerNote) {
      setTextColorHex(theme.colors.secondary);
      doc.setFontSize(10);
      doc.setFont(theme.fontBody, 'italic');
      doc.text(slide.footerNote, contentStartX, height - 15);
    }

    // 7. Page Number
    setTextColorHex(theme.colors.secondary);
    doc.setFont(theme.fontBody, 'normal');
    doc.setFontSize(10);
    doc.text(`${index + 1}`, width - 15, height - 15, { align: 'right' });
  });

  doc.save(`${data.topic.replace(/\s+/g, '_')}_presentation.pdf`);
};