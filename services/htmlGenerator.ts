
import saveAs from 'file-saver';

export const generateHtml = (elementId: string, themeColor: string) => {
  const contentElement = document.getElementById(elementId);
  if (!contentElement) {
    console.error("HTML generation failed: Element not found.");
    throw new Error("Elemen pratinjau tidak ditemukan.");
  }
  
  const content = contentElement.innerHTML;

  const html = `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Perencanaan Pembelajaran</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body {
        background-color: #f1f5f9; /* bg-slate-100 */
        font-family: 'Times New Roman', Times, serif;
      }
      .page-container {
        margin: 1cm;
      }
      .theme-bg-placeholder {
        background-color: ${themeColor} !important;
      }
      @media print {
        body {
          background-color: #fff;
        }
        .page-container {
           margin: 0;
           box-shadow: none;
        }
        @page {
          size: A4;
          margin: 1cm;
        }
      }
    </style>
</head>
<body>
    <div class="page-container">
      <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          ${content.replace(`style="background-color: ${themeColor};"`, 'class="theme-bg-placeholder"')}
      </div>
    </div>
</body>
</html>
  `;

  const blob = new Blob([html], { type: 'text/html;charset=utf-t' });
  saveAs(blob, 'Perencanaan_Pembelajaran.html');
};