import React, { useState, useEffect } from "react";

interface PDFViewerProps {
  url: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ url }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchPDFWithHeaders = async () => {
      try {
        const response = await fetch(url, {
          headers: {
            Accept: "application/pdf",
            "Content-Type": "application/pdf",
          },
          //   responseType: "blob",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        setPdfUrl(objectUrl);

        return () => {
          if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
          }
        };
      } catch (error) {
        console.error("Error fetching PDF:", error);
      }
    };

    fetchPDFWithHeaders();
  }, [url]);

  return pdfUrl ? (
    <iframe src={pdfUrl} width="100%" height="100vh" loading="lazy" />
  ) : null;
};
