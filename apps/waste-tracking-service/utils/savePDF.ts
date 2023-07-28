export const savePDF = (id, reference = null) => {
  return fetch(`/api/pdf?id=${id}`)
    .then((res) => res.blob())
    .then((readableStream) => {
      const blob = new Blob([readableStream], { type: 'application/pdf' });
      try {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        if (link.download !== undefined) {
          link.setAttribute('href', url);
          link.setAttribute('download', fileName(reference));
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

const fileName = (reference) => {
  return reference === null ? 'Annex VII' : `Annex VII - ${reference}`;
};
