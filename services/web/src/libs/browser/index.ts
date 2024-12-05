export async function downloadFile(url: string, name?: string | null) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to download file');
  }

  const blob = await response.blob();
  const blobUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = blobUrl;
  a.download = name ?? `file.${blob.type.split('/')[1]}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(blobUrl);
}
