export const savePDF = async (
  id: string,
  transactionId: string | undefined = undefined
) => {
  const baseUrl =
    process.env['NODE_ENV'] === 'production' ? '/export-annex-VII-waste' : '';
  return await fetch(`${baseUrl}/api/pdf?id=${id}`)
    .then((res) => res.blob())
    .then((readableStream) => {
      const blob = new Blob([readableStream], { type: 'application/pdf' });
      try {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        if (link.download !== undefined) {
          link.setAttribute('href', url);
          link.setAttribute('download', fileName(transactionId));
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (e) {
        console.error('Unable to create PDF', e);
      }
    })
    .catch((e) => console.error(e));
};

const fileName = (transactionId) => {
  return transactionId === null ? 'AnnexVII' : `AnnexVII_${transactionId}`;
};
