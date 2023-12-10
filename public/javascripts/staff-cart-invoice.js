window.jsPDF = window.jspdf.jsPDF;
window.html2canvas = html2canvas;
window.html2PDF = html2PDF;


$('#btn-export').click(function() {
    html2PDF($('#invoice')[0], {
        jsPDF: {
          format: 'a4',
        },
        imageType: 'image/jpeg',
        output: 'invoice.pdf'
      });
})